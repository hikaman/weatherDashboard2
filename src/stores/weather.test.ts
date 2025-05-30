import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { get } from 'svelte/store';
import { weatherStore, fetchWeatherData, searchCities, type WeatherData, isNightAtLocation } from './weather';

// Mock fetch
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

describe('Weather Store', () => {
	beforeEach(() => {
		vi.clearAllMocks();
		weatherStore.set({ data: null, loading: false, error: null });
	});

	it('should initialize with correct default state', () => {
		const state = get(weatherStore);
		expect(state.data).toBeNull();
		expect(state.loading).toBe(false);
		expect(state.error).toBeNull();
	});

	it('should set loading state when fetching weather data', async () => {
		const mockWeatherData: WeatherData = {
			current: {
				temperature_2m: 20,
				relative_humidity_2m: 65,
				wind_speed_10m: 10,
				precipitation: 0,
				weather_code: 0,
			},
			daily: {
				time: ['2025-01-01'],
				temperature_2m_max: [25],
				temperature_2m_min: [15],
				precipitation_sum: [0],
				weather_code: [0],
				wind_speed_10m_max: [12],
			},
			hourly: {
				time: ['2025-01-01T00:00'],
				temperature_2m: [20],
				precipitation_probability: [10],
				precipitation: [0],
				weather_code: [0],
				wind_speed_10m: [10],
				relative_humidity_2m: [65],
			},
			latitude: 52.52,
			longitude: 13.41,
			timezone: 'Europe/Berlin',
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockWeatherData,
		});

		const fetchPromise = fetchWeatherData(52.52, 13.41);
		
		// Check loading state
		const loadingState = get(weatherStore);
		expect(loadingState.loading).toBe(true);

		await fetchPromise;

		// Check final state
		const finalState = get(weatherStore);
		expect(finalState.loading).toBe(false);
		expect(finalState.data).toEqual(mockWeatherData);
		expect(finalState.error).toBeNull();
	});

	it('should handle fetch errors correctly', async () => {
		mockFetch.mockRejectedValueOnce(new Error('Network error'));

		await fetchWeatherData(52.52, 13.41);

		const state = get(weatherStore);
		expect(state.loading).toBe(false);
		expect(state.data).toBeNull();
		expect(state.error).toBe('Network error');
	});

	it('should search cities successfully', async () => {
		const mockCities = {
			results: [
				{
					name: 'Berlin',
					latitude: 52.52,
					longitude: 13.41,
					country: 'Germany',
				},
			],
		};

		mockFetch.mockResolvedValueOnce({
			ok: true,
			json: async () => mockCities,
		});

		const cities = await searchCities('Berlin');
		expect(cities).toEqual(mockCities.results);
	});

	it('should return empty array for short queries', async () => {
		const cities = await searchCities('B');
		expect(cities).toEqual([]);
	});

	it('should sanitize search input', async () => {
		const cities = await searchCities('<script>alert("xss")</script>');
		expect(cities).toEqual([]);
	});
});

describe('isNightAtLocation', () => {
	function setWeather({ sunrise, sunset, timezone, now }: { sunrise: string, sunset: string, timezone: string, now: string }) {
		weatherStore.set({
			data: {
				current: {
					temperature_2m: 20,
					relative_humidity_2m: 50,
					wind_speed_10m: 10,
					precipitation: 0,
					weather_code: 0,
					apparent_temperature: 20,
					uv_index: 5,
				},
				daily: {
					time: [now.slice(0, 10)],
					sunrise: [sunrise],
					sunset: [sunset],
					temperature_2m_max: [25],
					temperature_2m_min: [15],
					precipitation_sum: [0],
					weather_code: [0],
					wind_speed_10m_max: [12],
				},
				hourly: {
					time: [now],
					temperature_2m: [20],
					precipitation_probability: [0],
					precipitation: [0],
					weather_code: [0],
					wind_speed_10m: [10],
					relative_humidity_2m: [50],
					uv_index: [5],
				},
				latitude: 0,
				longitude: 0,
				timezone,
			},
			loading: false,
			error: null,
			currentLocation: 'Test',
		});
	}

	afterEach(() => {
		globalThis.__TEST_NOW = undefined;
	});

	it('returns false during the day', () => {
		setWeather({
			sunrise: '2025-05-25T05:00:00+02:00',
			sunset: '2025-05-25T21:00:00+02:00',
			timezone: 'Europe/Berlin',
			now: '2025-05-25T12:00:00+02:00',
		});
		globalThis.__TEST_NOW = '2025-05-25T12:00:00+02:00';
		expect(get(isNightAtLocation)).toBe(false);
	});

	it('returns true at night', () => {
		setWeather({
			sunrise: '2025-05-25T05:00:00+02:00',
			sunset: '2025-05-25T21:00:00+02:00',
			timezone: 'Europe/Berlin',
			now: '2025-05-25T23:00:00+02:00',
		});
		globalThis.__TEST_NOW = '2025-05-25T23:00:00+02:00';
		expect(get(isNightAtLocation)).toBe(true);
	});

	it('returns true before sunrise', () => {
		setWeather({
			sunrise: '2025-05-25T05:00:00+02:00',
			sunset: '2025-05-25T21:00:00+02:00',
			timezone: 'Europe/Berlin',
			now: '2025-05-25T04:00:00+02:00',
		});
		globalThis.__TEST_NOW = '2025-05-25T04:00:00+02:00';
		expect(get(isNightAtLocation)).toBe(true);
	});

	it('returns false exactly at sunrise', () => {
		setWeather({
			sunrise: '2025-05-25T05:00:00+02:00',
			sunset: '2025-05-25T21:00:00+02:00',
			timezone: 'Europe/Berlin',
			now: '2025-05-25T05:00:00+02:00',
		});
		globalThis.__TEST_NOW = '2025-05-25T05:00:00+02:00';
		expect(get(isNightAtLocation)).toBe(false);
	});

	it('returns true exactly at sunset', () => {
		setWeather({
			sunrise: '2025-05-25T05:00:00+02:00',
			sunset: '2025-05-25T21:00:00+02:00',
			timezone: 'Europe/Berlin',
			now: '2025-05-25T21:00:00+02:00',
		});
		globalThis.__TEST_NOW = '2025-05-25T21:00:00+02:00';
		expect(get(isNightAtLocation)).toBe(true);
	});

	it('returns false if data is missing', () => {
		weatherStore.set({ data: null, loading: false, error: null, currentLocation: null });
		globalThis.__TEST_NOW = undefined;
		expect(get(isNightAtLocation)).toBe(false);
	});
}); 