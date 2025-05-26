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

	function formatHour(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleTimeString('en-US', {
			hour: 'numeric',
			hour12: true,
		});
	}

	function formatDay(dateString: string): string {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return 'Today';
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return 'Tomorrow';
		} else {
			return date.toLocaleDateString('en-US', { weekday: 'short' });
		}
	}

	function getPrecipitationColor(probability: number): string {
		if (probability >= 70) return 'text-blue-600 dark:text-blue-400';
		if (probability >= 40) return 'text-yellow-600 dark:text-yellow-400';
		if (probability >= 20) return 'text-green-600 dark:text-green-400';
		return 'text-gray-500 dark:text-gray-400';
	}

	// Get next 24 hours of data
	$: hourlyData = weather?.hourly ? weather.hourly.time.slice(0, 24).map((time, index) => ({
		time,
		temperature: weather.hourly.temperature_2m[index],
		precipitation_probability: weather.hourly.precipitation_probability[index],
		precipitation: weather.hourly.precipitation[index],
		weather_code: weather.hourly.weather_code[index],
		wind_speed: weather.hourly.wind_speed_10m[index],
		humidity: weather.hourly.relative_humidity_2m[index],
	})) : [];
</script>

<div class="hourly-forecast">
	{#if weather && hourlyData.length > 0}
		<div class="glass-card-lg p-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
			<h3 class="text-xl font-bold text-glass mb-4 flex items-center">
				<span class="text-2xl mr-3">⏰</span>
				24-Hour Forecast
			</h3>
			
			<div class="overflow-x-auto">
				<div class="flex space-x-4 pb-4" style="min-width: max-content;">
					{#each hourlyData as hour, index}
						{@const isNewDay = index === 0 || formatDay(hour.time) !== formatDay(hourlyData[index - 1].time)}
						
						<div class="flex-shrink-0 text-center min-w-[80px]">
							<!-- Always reserve space for day label to maintain alignment -->
							<div class="text-xs font-semibold text-glass-muted mb-1 border-b border-glass-light-border dark:border-glass-dark-border pb-1 h-5">
								{#if isNewDay}
									{formatDay(hour.time)}
								{:else}
									<!-- Empty space to maintain alignment -->
									&nbsp;
								{/if}
							</div>
							
							<div class="glass-card rounded-glass p-3 hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 hover:scale-105">
								<!-- Time -->
								<div class="text-sm font-medium text-glass-secondary mb-2">
									{formatHour(hour.time)}
								</div>
								
								<!-- Weather Icon -->
								<div class="text-2xl mb-2">
									{getWeatherIcon(hour.weather_code)}
								</div>
								
								<!-- Temperature -->
								<div class="text-lg font-bold text-glass mb-1">
									{Math.round(hour.temperature)}°
								</div>
								
								<!-- Precipitation Probability -->
								<div class="text-xs {getPrecipitationColor(hour.precipitation_probability)} mb-1">
									💧 {hour.precipitation_probability}%
								</div>
								
								<!-- Wind Speed -->
								<div class="text-xs text-glass-muted">
									💨 {Math.round(hour.wind_speed)} km/h
								</div>
							</div>
						</div>
					{/each}
				</div>
			</div>
			
			<!-- Legend -->
			<div class="mt-4 flex flex-wrap gap-4 text-xs text-glass-muted">
				<div class="flex items-center">
					<span class="mr-1">💧</span>
					<span>Precipitation chance</span>
				</div>
				<div class="flex items-center">
					<span class="mr-1">💨</span>
					<span>Wind speed</span>
				</div>
				<div class="flex items-center">
					<span class="mr-1">🌡️</span>
					<span>Temperature</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="glass-card-lg p-8 text-center hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300">
			<div class="text-6xl mb-4">⏰</div>
			<h3 class="text-xl font-bold text-glass mb-2">No Hourly Data</h3>
			<p class="text-glass-secondary">Hourly forecast data is not available.</p>
		</div>
	{/if}
</div>

<style>
	/* Enhanced glassmorphism effects for hourly forecast */
	.glass-card:hover {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	/* Custom scrollbar styling for glassmorphism */
	.hourly-forecast :global(.overflow-x-auto) {
		scrollbar-width: thin;
		scrollbar-color: rgba(255, 255, 255, 0.3) transparent;
	}
	
	.hourly-forecast :global(.overflow-x-auto::-webkit-scrollbar) {
		height: 6px;
	}
	
	.hourly-forecast :global(.overflow-x-auto::-webkit-scrollbar-track) {
		background: rgba(255, 255, 255, 0.1);
		border-radius: 3px;
	}
	
	.hourly-forecast :global(.overflow-x-auto::-webkit-scrollbar-thumb) {
		background: rgba(255, 255, 255, 0.3);
		border-radius: 3px;
	}
	
	.hourly-forecast :global(.overflow-x-auto::-webkit-scrollbar-thumb:hover) {
		background: rgba(255, 255, 255, 0.5);
	}
	
	@media (prefers-color-scheme: dark) {
		.hourly-forecast :global(.overflow-x-auto) {
			scrollbar-color: rgba(71, 85, 105, 0.3) transparent;
		}
		
		.hourly-forecast :global(.overflow-x-auto::-webkit-scrollbar-track) {
			background: rgba(15, 23, 42, 0.1);
		}
		
		.hourly-forecast :global(.overflow-x-auto::-webkit-scrollbar-thumb) {
			background: rgba(71, 85, 105, 0.3);
		}
		
		.hourly-forecast :global(.overflow-x-auto::-webkit-scrollbar-thumb:hover) {
			background: rgba(71, 85, 105, 0.5);
		}
	}
</style> 