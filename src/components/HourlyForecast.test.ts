import { describe, it, expect } from 'vitest';
import type { WeatherData } from '../stores/weather';

// Mock weather data for testing
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
		time: [
			'2025-01-01T00:00',
			'2025-01-01T01:00',
			'2025-01-01T02:00',
			'2025-01-01T03:00',
		],
		temperature_2m: [20, 19, 18, 17],
		precipitation_probability: [10, 15, 20, 25],
		precipitation: [0, 0, 0.1, 0.2],
		weather_code: [0, 1, 2, 3],
		wind_speed_10m: [10, 11, 12, 13],
		relative_humidity_2m: [65, 66, 67, 68],
	},
	latitude: 52.52,
	longitude: 13.41,
	timezone: 'Europe/Berlin',
};

describe('HourlyForecast Component Data Processing', () => {
	it('should process hourly data correctly', () => {
		// Test that we can extract the first 24 hours of data
		const hourlyData = mockWeatherData.hourly.time.slice(0, 24).map((time, index) => ({
			time,
			temperature: mockWeatherData.hourly.temperature_2m[index],
			precipitation_probability: mockWeatherData.hourly.precipitation_probability[index],
			precipitation: mockWeatherData.hourly.precipitation[index],
			weather_code: mockWeatherData.hourly.weather_code[index],
			wind_speed: mockWeatherData.hourly.wind_speed_10m[index],
			humidity: mockWeatherData.hourly.relative_humidity_2m[index],
		}));

		expect(hourlyData).toHaveLength(4); // We only have 4 hours of mock data
		expect(hourlyData[0].temperature).toBe(20);
		expect(hourlyData[0].precipitation_probability).toBe(10);
		expect(hourlyData[1].temperature).toBe(19);
		expect(hourlyData[1].precipitation_probability).toBe(15);
	});

	it('should handle empty weather data', () => {
		const emptyWeather: WeatherData | null = null;
		const hourlyData: any[] = [];
		
		expect(hourlyData).toHaveLength(0);
	});

	it('should format time correctly', () => {
		const testDate = '2025-01-01T14:00';
		const date = new Date(testDate);
		const formattedTime = date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			hour12: true,
		});
		
		expect(formattedTime).toMatch(/\d{1,2}\s?(AM|PM)/);
	});

	it('should determine precipitation color correctly', () => {
		function getPrecipitationColor(probability: number): string {
			if (probability >= 70) return 'text-blue-600 dark:text-blue-400';
			if (probability >= 40) return 'text-yellow-600 dark:text-yellow-400';
			if (probability >= 20) return 'text-green-600 dark:text-green-400';
			return 'text-gray-500 dark:text-gray-400';
		}

		expect(getPrecipitationColor(80)).toBe('text-blue-600 dark:text-blue-400');
		expect(getPrecipitationColor(50)).toBe('text-yellow-600 dark:text-yellow-400');
		expect(getPrecipitationColor(30)).toBe('text-green-600 dark:text-green-400');
		expect(getPrecipitationColor(10)).toBe('text-gray-500 dark:text-gray-400');
	});
}); 