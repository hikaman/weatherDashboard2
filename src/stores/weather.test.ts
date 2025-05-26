import { describe, it, expect, vi, beforeEach } from 'vitest';
import { get } from 'svelte/store';
import { weatherStore, fetchWeatherData, searchCities, type WeatherData } from './weather';

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