import { writable, derived } from 'svelte/store';

declare global {
	// Used for deterministic testing of isNightAtLocation
	var __TEST_NOW: string | undefined;
}

export interface CurrentWeather {
	temperature_2m: number;
	relative_humidity_2m: number;
	wind_speed_10m: number;
	precipitation: number;
	weather_code: number;
	apparent_temperature: number;
	uv_index: number;
}

export interface DailyWeather {
	time: string[];
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	precipitation_sum: number[];
	weather_code: number[];
	wind_speed_10m_max: number[];
	sunrise: string[];
	sunset: string[];
}

export interface HourlyWeather {
	time: string[];
	temperature_2m: number[];
	precipitation_probability: number[];
	precipitation: number[];
	weather_code: number[];
	wind_speed_10m: number[];
	relative_humidity_2m: number[];
	uv_index: number[];
}

export interface WeatherData {
	current: CurrentWeather;
	daily: DailyWeather;
	hourly: HourlyWeather;
	latitude: number;
	longitude: number;
	timezone: string;
}

export interface WeatherState {
	data: WeatherData | null;
	loading: boolean;
	error: string | null;
	currentLocation: string | null;
}

export interface GeocodingResult {
	name: string;
	latitude: number;
	longitude: number;
	country: string;
	admin1?: string;
}

export interface GeocodingResponse {
	results: GeocodingResult[];
}

const initialState: WeatherState = {
	data: null,
	loading: false,
	error: null,
	currentLocation: null,
};

export const weatherStore = writable<WeatherState>(initialState);

const WEATHER_CACHE_KEY = 'weatherwise-weather-cache';

function saveWeatherCache(data: WeatherData, locationName: string) {
	try {
		localStorage.setItem(
			WEATHER_CACHE_KEY,
			JSON.stringify({ data, locationName, timestamp: Date.now() })
		);
	} catch {}
}

export function loadWeatherCache(): { data: WeatherData; locationName: string } | null {
	try {
		const raw = localStorage.getItem(WEATHER_CACHE_KEY);
		if (!raw) return null;
		const parsed = JSON.parse(raw);
		if (
			typeof parsed === 'object' &&
			parsed.data &&
			typeof parsed.locationName === 'string'
		) {
			return { data: parsed.data, locationName: parsed.locationName };
		}
		return null;
	} catch {
		return null;
	}
}

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
	return input.replace(/[<>\"'&]/g, '').trim();
}

// Fetch weather data from Open-Meteo API
export async function fetchWeatherData(latitude: number, longitude: number, locationName?: string): Promise<void> {
	weatherStore.update((state) => ({ ...state, loading: true, error: null }));

	try {
		// Always request yesterday's data
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code,apparent_temperature,uv_index&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,relative_humidity_2m,uv_index&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max,sunrise,sunset&timezone=auto&forecast_days=7&forecast_hours=24&past_days=1`;

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Weather API error: ${response.status}`);
		}

		const data: WeatherData = await response.json();
		// Validate required fields
		if (!data.current || !data.daily || !data.hourly) {
			throw new Error('Invalid weather data received');
		}

		// Timezone handling: Open-Meteo returns dates in UTC or the requested timezone. We use the API's date strings directly for comparison.

		// Check if yesterday's data is present
		const todayStr = new Date().toISOString().slice(0, 10); // UTC date string
		const idxToday = data.daily.time.findIndex((d) => d === todayStr);
		const idxYesterday = idxToday - 1;
		if (idxYesterday < 0) {
			console.warn('[fetchWeatherData] Yesterday\'s data is missing from API response. daily.time:', data.daily.time);
			// Continue normally - the app will handle missing yesterday data gracefully
		}

		// Get location name if not provided
		let currentLocation: string = locationName || '';
		if (!currentLocation) {
			try {
				currentLocation = await reverseGeocode(latitude, longitude);
			} catch (error) {
				console.warn('Failed to get location name:', error);
				currentLocation = `${latitude.toFixed(2)}, ${longitude.toFixed(2)}`;
			}
		}

		// Save to cache
		saveWeatherCache(data, currentLocation);

		weatherStore.update((state) => ({
			...state,
			data,
			currentLocation,
			loading: false,
			error: null,
		}));
	} catch (error) {
		const errorMessage = error instanceof Error ? error.message : 'Failed to fetch weather data';
		weatherStore.update((state) => ({
			...state,
			loading: false,
			error: errorMessage,
		}));
	}
}

// Search cities using Open-Meteo geocoding API
export async function searchCities(query: string): Promise<GeocodingResult[]> {
	if (!query || query.length < 2) {
		return [];
	}

	const sanitizedQuery = sanitizeInput(query);
	if (!sanitizedQuery) {
		return [];
	}

	try {
		const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(sanitizedQuery)}&count=5&language=en&format=json`;
		
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Geocoding API error: ${response.status}`);
		}

		const data: GeocodingResponse = await response.json();
		return data.results || [];
	} catch (error) {
		console.error('Error searching cities:', error);
		return [];
	}
}

// Get user's current location
export async function getCurrentLocation(): Promise<{ latitude: number; longitude: number } | null> {
	return new Promise((resolve) => {
		if (!navigator.geolocation) {
			resolve(null);
			return;
		}

		navigator.geolocation.getCurrentPosition(
			(position) => {
				resolve({
					latitude: position.coords.latitude,
					longitude: position.coords.longitude,
				});
			},
			() => {
				resolve(null);
			},
			{
				timeout: 10000,
				enableHighAccuracy: false,
			}
		);
	});
}

// Reverse geocode coordinates to get location name
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
	try {
		const url = `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`;
		
		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Reverse geocoding API error: ${response.status}`);
		}

		const data: GeocodingResponse = await response.json();
		if (data.results && data.results.length > 0) {
			const result = data.results[0];
			return result.admin1 ? `${result.name}, ${result.admin1}` : result.name;
		}
		
		throw new Error('No location found');
	} catch (error) {
		console.error('Reverse geocoding error:', error);
		throw error;
	}
} 

// Derived store: is it night at the selected location?
// For testing, set globalThis.__TEST_NOW to an ISO string to override the current time.
export const isNightAtLocation = derived(weatherStore, ($ws) => {
	const data = $ws.data;
	if (!data || !data.daily || !data.daily.sunrise || !data.daily.sunset) return false;
	// Find today's index
	const todayISO = (globalThis.__TEST_NOW ? new Date(globalThis.__TEST_NOW) : new Date()).toISOString().slice(0, 10);
	const idx = data.daily.time.findIndex((d) => d === todayISO);
	if (idx === -1) return false;
	const sunrise = data.daily.sunrise[idx];
	const sunset = data.daily.sunset[idx];
	// Always compare times in UTC to avoid timezone issues
	try {
		let nowDate: Date;
		if (typeof globalThis !== 'undefined' && globalThis.__TEST_NOW) {
			nowDate = new Date(globalThis.__TEST_NOW);
		} else {
			const now = new Date().toLocaleString('en-US', { timeZone: data.timezone });
			nowDate = new Date(now);
		}
		const sunriseDate = new Date(sunrise);
		const sunsetDate = new Date(sunset);
		// Compare using UTC values
		return nowDate.getTime() < sunriseDate.getTime() || nowDate.getTime() >= sunsetDate.getTime();
	} catch {
		// Fallback: use local time
		const now = new Date();
		const sunriseDate = new Date(sunrise);
		const sunsetDate = new Date(sunset);
		return now.getTime() < sunriseDate.getTime() || now.getTime() >= sunsetDate.getTime();
	}
}); 