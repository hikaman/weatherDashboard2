<script lang="ts">
	import type { WeatherData } from '../stores/weather';
	import { t, currentLocale } from '../lib/i18n';
	import AnimatedWeatherIcon from './AnimatedWeatherIcon.svelte';
	import { isNightAtLocation as isNightAtLocationStore } from '../stores/weather';

	export let weather: WeatherData | null;

	// Weather code descriptions - now using translations
	function getWeatherDescription(code: number): string {
		const descriptions: Record<number, keyof typeof $t> = {
			0: 'clearSky',
			1: 'mainlyClear',
			2: 'partlyCloudy',
			3: 'overcast',
			45: 'fog',
			48: 'depositingRimeFog',
			51: 'lightDrizzle',
			53: 'moderateDrizzle',
			55: 'denseDrizzle',
			61: 'slightRain',
			63: 'moderateRain',
			65: 'heavyRain',
			71: 'slightSnowFall',
			73: 'moderateSnowFall',
			75: 'heavySnowFall',
			80: 'slightRainShowers',
			81: 'moderateRainShowers',
			82: 'violentRainShowers',
			95: 'thunderstorm',
		};
		return $t[descriptions[code]] || $t.clearSky;
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

	function formatHour(dateString: string): string {
		const date = new Date(dateString);
		const locale = $currentLocale === 'de' ? 'de-DE' : 'en-US';
		return date.toLocaleTimeString(locale, {
			hour: '2-digit',
			minute: '2-digit',
			hour12: $currentLocale !== 'de',
		});
	}

	function formatDay(dateString: string): string {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return $t.today;
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return $t.tomorrow;
		} else {
			// Use German day abbreviations
			const dayNames = [$t.sunday, $t.monday, $t.tuesday, $t.wednesday, $t.thursday, $t.friday, $t.saturday];
			return dayNames[date.getDay()];
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

	$: isNight = $isNightAtLocationStore;

	// Helper: is this hour at night?
	function isNightAtHour(hourTime: string): boolean {
		if (!weather?.daily?.time || !weather.daily.sunrise || !weather.daily.sunset) return false;
		const dayIdx = weather.daily.time.findIndex((d) => hourTime.startsWith(d));
		if (dayIdx === -1) return false;
		const sunrise = new Date(weather.daily.sunrise[dayIdx]);
		const sunset = new Date(weather.daily.sunset[dayIdx]);
		const hour = new Date(hourTime);
		return hour < sunrise || hour >= sunset;
	}
</script>

<div class="hourly-forecast">
	{#if weather && hourlyData.length > 0}
		<div class="glass-card-lg p-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
			<h3 class="text-xl font-bold text-glass mb-4 flex items-center">
				<span class="text-2xl mr-3">⏰</span>
				{$t.hourlyForecastTitle}
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
							
							<div class="glass-card rounded-glass p-3 hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 hover:scale-105" tabindex="0">
								<!-- Time -->
								<div class="text-sm font-medium text-glass-secondary mb-2">
									{formatHour(hour.time)}
								</div>
								
								<!-- Weather Icon -->
								<div class="text-2xl mb-2">
									<AnimatedWeatherIcon code={hour.weather_code} isNight={isNightAtHour(hour.time)} />
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
					<span>{$t.precipitationChanceLegend}</span>
				</div>
				<div class="flex items-center">
					<span class="mr-1">💨</span>
					<span>{$t.windSpeedLegend}</span>
				</div>
				<div class="flex items-center">
					<span class="mr-1">🌡️</span>
					<span>{$t.temperatureLegend}</span>
				</div>
			</div>
		</div>
	{:else}
		<div class="glass-card-lg p-8 text-center hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300">
			<div class="text-6xl mb-4">⏰</div>
			<h3 class="text-xl font-bold text-glass mb-2">{$t.noHourlyData}</h3>
			<p class="text-glass-secondary">{$t.hourlyDataUnavailable}</p>
		</div>
	{/if}
</div>

<style>
	/* Enhanced glassmorphism effects for hourly forecast */
	.glass-card:hover {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	.glass-card:focus-visible {
		outline: 2px solid #38bdf8;
		outline-offset: 2px;
		box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
	}
	.text-glass, .text-glass-muted, .text-glass-secondary {
		text-shadow: 0 1px 2px rgba(0,0,0,0.08), 0 0px 1px rgba(0,0,0,0.12);
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