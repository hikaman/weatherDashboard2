import { writable } from 'svelte/store';

export interface CurrentWeather {
	temperature_2m: number;
	relative_humidity_2m: number;
	wind_speed_10m: number;
	precipitation: number;
	weather_code: number;
}

export interface DailyWeather {
	time: string[];
	temperature_2m_max: number[];
	temperature_2m_min: number[];
	precipitation_sum: number[];
	weather_code: number[];
	wind_speed_10m_max: number[];
}

export interface HourlyWeather {
	time: string[];
	temperature_2m: number[];
	precipitation_probability: number[];
	precipitation: number[];
	weather_code: number[];
	wind_speed_10m: number[];
	relative_humidity_2m: number[];
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
};

export const weatherStore = writable<WeatherState>(initialState);

// Sanitize input to prevent XSS
function sanitizeInput(input: string): string {
	return input.replace(/[<>\"'&]/g, '').trim();
}

// Fetch weather data from Open-Meteo API
export async function fetchWeatherData(latitude: number, longitude: number): Promise<void> {
	weatherStore.update((state) => ({ ...state, loading: true, error: null }));

	try {
		const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m,weather_code&hourly=temperature_2m,precipitation_probability,precipitation,weather_code,wind_speed_10m,relative_humidity_2m&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,weather_code,wind_speed_10m_max&timezone=auto&forecast_days=7&forecast_hours=24`;

		const response = await fetch(url);
		if (!response.ok) {
			throw new Error(`Weather API error: ${response.status}`);
		}

		const data: WeatherData = await response.json();
		
		// Validate required fields
		if (!data.current || !data.daily || !data.hourly) {
			throw new Error('Invalid weather data received');
		}

		weatherStore.update((state) => ({
			...state,
			data,
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