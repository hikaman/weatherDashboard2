<script lang="ts">
	import type { WeatherData } from '../stores/weather';

	export let weather: WeatherData | null;

	// Weather code descriptions
	const weatherDescriptions: Record<number, string> = {
		0: 'Clear sky',
		1: 'Mainly clear',
		2: 'Partly cloudy',
		3: 'Overcast',
		45: 'Fog',
		48: 'Depositing rime fog',
		51: 'Light drizzle',
		53: 'Moderate drizzle',
		55: 'Dense drizzle',
		61: 'Slight rain',
		63: 'Moderate rain',
		65: 'Heavy rain',
		71: 'Slight snow fall',
		73: 'Moderate snow fall',
		75: 'Heavy snow fall',
		80: 'Slight rain showers',
		81: 'Moderate rain showers',
		82: 'Violent rain showers',
		95: 'Thunderstorm',
	};

	function getWeatherDescription(code: number): string {
		return weatherDescriptions[code] || 'Unknown';
	}

	function getWeatherIcon(code: number): string {
		if (code === 0) return '☀️';
		if (code <= 3) return '⛅';
		if (code <= 48) return '🌫️';
		if (code <= 57) return '🌦️';
		if (code <= 67) return '🌧️';
		if (code <= 77) return '❄️';
		if (code <= 82) return '🌧️';
		if (code <= 86) return '🌨️';
		if (code >= 95) return '⛈️';
		return '🌤️';
	}

	function formatDate(dateString: string): string {
		return new Date(dateString).toLocaleDateString('en-US', {
			weekday: 'short',
			month: 'short',
			day: 'numeric',
		});
	}
</script>

<div class="weather-display">
	{#if weather}
		<!-- Current Weather Card -->
		<div class="current-weather-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6 hover:shadow-xl transition-shadow">
			<h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
				<span class="text-3xl mr-3">{getWeatherIcon(weather.current.weather_code)}</span>
				Current Weather
			</h2>
			
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div class="weather-stat">
					<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
						{weather.current.temperature_2m}°C
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">Temperature</div>
				</div>
				
				<div class="weather-stat">
					<div class="text-xl font-semibold text-gray-900 dark:text-white">
						{weather.current.relative_humidity_2m}%
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
				</div>
				
				<div class="weather-stat">
					<div class="text-xl font-semibold text-gray-900 dark:text-white">
						{weather.current.wind_speed_10m} km/h
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">Wind Speed</div>
				</div>
				
				<div class="weather-stat">
					<div class="text-xl font-semibold text-gray-900 dark:text-white">
						{weather.current.precipitation} mm
					</div>
					<div class="text-sm text-gray-600 dark:text-gray-400">Precipitation</div>
				</div>
			</div>
			
			<div class="mt-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
				<div class="text-lg font-medium text-gray-900 dark:text-white">
					{getWeatherDescription(weather.current.weather_code)}
				</div>
			</div>
		</div>

		<!-- 7-Day Forecast -->
		<div class="forecast-card bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 hover:shadow-xl transition-shadow">
			<h3 class="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center">
				<span class="text-xl mr-2">📅</span>
				7-Day Forecast
			</h3>
			<div class="overflow-x-auto">
				<div class="flex md:grid md:grid-cols-7 gap-2 md:gap-4 min-w-max">
					{#each weather.daily.time as date, index}
						<div class="forecast-day bg-gray-50 dark:bg-gray-700 rounded-md p-2 md:p-3 text-center flex flex-col items-center min-w-[72px] md:min-w-0 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
							<div class="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
								{formatDate(date)}
							</div>
							<div class="text-xl mb-1">
								{getWeatherIcon(weather.daily.weather_code[index])}
							</div>
							<div class="flex items-center justify-center gap-1 mb-1">
								<span class="text-base font-bold text-gray-900 dark:text-white">{weather.daily.temperature_2m_max[index]}°</span>
								<span class="text-xs text-gray-500 dark:text-gray-400">/ {weather.daily.temperature_2m_min[index]}°</span>
							</div>
							<div class="text-xs text-blue-600 dark:text-blue-400">
								💧 {weather.daily.precipitation_sum[index]} mm
							</div>
						</div>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="no-weather bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 text-center">
			<div class="text-6xl mb-4">🌤️</div>
			<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-2">No Weather Data</h2>
			<p class="text-gray-600 dark:text-gray-400">Search for a city or allow location access to see weather information.</p>
		</div>
	{/if}
</div>

<style>
	.weather-stat {
		@apply text-center;
	}
	
	.forecast-day:hover {
		@apply transform scale-105;
	}
	
	.current-weather-card:hover,
	.forecast-card:hover {
		@apply transform scale-105;
	}
	
	/* Compact forecast styles */
	.forecast-card .forecast-day {
		@apply p-2 md:p-3 min-w-[72px] md:min-w-0;
	}
	.forecast-card .text-xl {
		font-size: 1.25rem;
	}
	.forecast-card .text-base {
		font-size: 1rem;
	}
	.forecast-card .text-xs {
		font-size: 0.75rem;
	}
</style> 