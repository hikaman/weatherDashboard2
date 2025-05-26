import { describe, it, expect } from 'vitest';
import { getWeatherTheme } from './weatherThemes';

describe('getWeatherTheme', () => {
	it('returns cloudy theme for undefined weather code', () => {
		const theme = getWeatherTheme(undefined);
		expect(theme).toEqual({
			background: 'weather-bg-cloudy',
			name: 'cloudy'
		});
	});

	it('returns sunny theme for weather code 0', () => {
		const theme = getWeatherTheme(0);
		expect(theme).toEqual({
			background: 'weather-bg-sunny',
			name: 'sunny'
		});
	});

	it('returns sunny theme for clear sky (code 0)', () => {
		const theme = getWeatherTheme(0);
		expect(theme).toEqual({
			background: 'weather-bg-sunny',
			name: 'sunny'
		});
	});

	it('returns cloudy theme for partly cloudy conditions (codes 1-3)', () => {
		const codes = [1, 2, 3];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-cloudy',
				name: 'cloudy'
			});
		});
	});

	it('returns foggy theme for fog conditions (codes 45-48)', () => {
		const codes = [45, 46, 47, 48];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-foggy',
				name: 'foggy'
			});
		});
	});

	it('returns rainy theme for drizzle conditions (codes 51-57)', () => {
		const codes = [51, 53, 55, 56, 57];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-rainy',
				name: 'rainy'
			});
		});
	});

	it('returns rainy theme for rain conditions (codes 61-67)', () => {
		const codes = [61, 63, 65, 66, 67];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-rainy',
				name: 'rainy'
			});
		});
	});

	it('returns snowy theme for snow conditions (codes 71-77)', () => {
		const codes = [71, 73, 75, 77];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-snowy',
				name: 'snowy'
			});
		});
	});

	it('returns rainy theme for rain showers (codes 80-82)', () => {
		const codes = [80, 81, 82];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-rainy',
				name: 'rainy'
			});
		});
	});

	it('returns snowy theme for snow showers (codes 85-86)', () => {
		const codes = [85, 86];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-snowy',
				name: 'snowy'
			});
		});
	});

	it('returns stormy theme for thunderstorm conditions (codes 95-99)', () => {
		const codes = [95, 96, 99];
		codes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-stormy',
				name: 'stormy'
			});
		});
	});

	it('returns cloudy theme for unknown weather codes', () => {
		const unknownCodes = [10, 20, 30, 40, 50, 60, 70, 90, 100];
		unknownCodes.forEach(code => {
			const theme = getWeatherTheme(code);
			expect(theme).toEqual({
				background: 'weather-bg-cloudy',
				name: 'cloudy'
			});
		});
	});

	it('returns correct theme structure with required properties', () => {
		const theme = getWeatherTheme(0);
		expect(theme).toHaveProperty('background');
		expect(theme).toHaveProperty('name');
		expect(typeof theme.background).toBe('string');
		expect(typeof theme.name).toBe('string');
	});
}); 