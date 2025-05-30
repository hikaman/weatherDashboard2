export interface WeatherTheme {
	background: string;
	name: string;
}

// Weather code to theme mapping based on Open-Meteo weather codes
export function getWeatherTheme(weatherCode: number | undefined): WeatherTheme {
	if (weatherCode === undefined || weatherCode === null) {
		return { background: 'weather-bg-cloudy', name: 'cloudy' };
	}

	// Clear sky
	if (weatherCode === 0) {
		return { background: 'weather-bg-sunny', name: 'sunny' };
	}

	// Mainly clear, partly cloudy, overcast
	if (weatherCode >= 1 && weatherCode <= 3) {
		return { background: 'weather-bg-cloudy', name: 'cloudy' };
	}

	// Fog and depositing rime fog
	if (weatherCode >= 45 && weatherCode <= 48) {
		return { background: 'weather-bg-foggy', name: 'foggy' };
	}

	// Drizzle: Light, moderate, and dense intensity
	if (weatherCode >= 51 && weatherCode <= 57) {
		return { background: 'weather-bg-rainy', name: 'rainy' };
	}

	// Rain: Slight, moderate and heavy intensity
	if (weatherCode >= 61 && weatherCode <= 67) {
		return { background: 'weather-bg-rainy', name: 'rainy' };
	}

	// Snow fall: Slight, moderate, and heavy intensity
	if (weatherCode >= 71 && weatherCode <= 77) {
		return { background: 'weather-bg-snowy', name: 'snowy' };
	}

	// Rain showers: Slight, moderate, and violent
	if (weatherCode >= 80 && weatherCode <= 82) {
		return { background: 'weather-bg-rainy', name: 'rainy' };
	}

	// Snow showers slight and heavy
	if (weatherCode >= 85 && weatherCode <= 86) {
		return { background: 'weather-bg-snowy', name: 'snowy' };
	}

	// Thunderstorm: Slight or moderate, with slight and heavy hail
	if (weatherCode >= 95 && weatherCode <= 99) {
		return { background: 'weather-bg-stormy', name: 'stormy' };
	}

	// Default to cloudy
	return { background: 'weather-bg-cloudy', name: 'cloudy' };
} 