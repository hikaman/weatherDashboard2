<script lang="ts">
	import type { WeatherData } from '../stores/weather';
	import { t } from '../lib/i18n';
	import AnimatedWeatherIcon from './AnimatedWeatherIcon.svelte';

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

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		const today = new Date();
		const tomorrow = new Date(today);
		tomorrow.setDate(today.getDate() + 1);

		if (date.toDateString() === today.toDateString()) {
			return $t.today;
		} else if (date.toDateString() === tomorrow.toDateString()) {
			return $t.tomorrow;
		} else {
			// Use localized day abbreviations
			const dayNames = [$t.sunday, $t.monday, $t.tuesday, $t.wednesday, $t.thursday, $t.friday, $t.saturday];
			const dayName = dayNames[date.getDay()];
			const dayNumber = date.getDate();
			const month = date.getMonth() + 1;
			return `${dayName} ${dayNumber}.${month}.`;
		}
	}
</script>

<div class="weather-display">
	{#if weather}
		<!-- Current Weather Card -->
		<div class="glass-card-lg p-6 mb-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
			<h2 class="text-2xl font-bold text-glass mb-4 flex items-center">
				<span class="mr-3"><AnimatedWeatherIcon code={weather.current.weather_code} /></span>
				{$t.currentWeather}
			</h2>
			
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4">
				<div class="weather-stat">
					<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
						{weather.current.temperature_2m}°C
					</div>
					<div class="text-sm text-glass-muted">{$t.temperature}</div>
				</div>
				
				<div class="weather-stat">
					<div class="text-xl font-semibold text-glass">
						{weather.current.relative_humidity_2m}%
					</div>
					<div class="text-sm text-glass-muted">{$t.humidity}</div>
				</div>
				
				<div class="weather-stat">
					<div class="text-xl font-semibold text-glass">
						{weather.current.wind_speed_10m} km/h
					</div>
					<div class="text-sm text-glass-muted">{$t.windSpeed}</div>
				</div>
				
				<div class="weather-stat">
					<div class="text-xl font-semibold text-glass">
						{weather.current.precipitation} mm
					</div>
					<div class="text-sm text-glass-muted">{$t.precipitation}</div>
				</div>
			</div>
			
			<div class="mt-4 p-3 glass-card rounded-glass">
				<div class="text-lg font-medium text-glass">
					{getWeatherDescription(weather.current.weather_code)}
				</div>
			</div>
		</div>

		<!-- 7-Day Forecast -->
		<div class="glass-card-lg p-4 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
			<h3 class="text-lg font-bold text-glass mb-2 flex items-center">
				<span class="text-xl mr-2">📅</span>
				{$t.sevenDayForecast}
			</h3>
			<div class="overflow-x-auto">
				<div class="flex md:grid md:grid-cols-7 gap-2 md:gap-4 min-w-max">
					{#each weather.daily.time as date, index}
						<div class="glass-card rounded-glass p-2 md:p-3 text-center flex flex-col items-center min-w-[72px] md:min-w-0 hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 hover:scale-105">
							<div class="text-xs font-medium text-glass-muted mb-1">
								{formatDate(date)}
							</div>
							<div class="text-xl mb-1">
								{getWeatherIcon(weather.daily.weather_code[index])}
							</div>
							<div class="flex items-center justify-center gap-1 mb-1">
								<span class="text-base font-bold text-glass">{weather.daily.temperature_2m_max[index]}°</span>
								<span class="text-xs text-glass-secondary">/ {weather.daily.temperature_2m_min[index]}°</span>
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
		<div class="glass-card-lg p-8 text-center hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300">
			<div class="text-6xl mb-4">🌤️</div>
			<h2 class="text-xl font-bold text-glass mb-2">{$t.noData}</h2>
			<p class="text-glass-secondary">{$t.noWeatherDataMessage}</p>
		</div>
	{/if}
</div>

<style>
	.weather-stat {
		@apply text-center;
	}
	
	/* Enhanced glassmorphism hover effects */
	.glass-card:hover,
	.glass-card-lg:hover {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
</style> 