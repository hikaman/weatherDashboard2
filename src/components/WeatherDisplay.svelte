<script lang="ts">
	import type { WeatherData } from '../stores/weather';
	import { t, currentLocale } from '../lib/i18n';
	import AnimatedWeatherIcon from './AnimatedWeatherIcon.svelte';
	import YesterdayComparisonBadge from './YesterdayComparisonBadge.svelte';
	import ExpandableDayRow from './ExpandableDayRow.svelte';
	import { isNightAtLocation as isNightAtLocationStore } from '../stores/weather';

	export let weather: WeatherData | null;
	export let currentLocation: string | null = null;
	let expandedIndex: number | null = null;

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

	function handleDayClick(idx: number) {
		expandedIndex = expandedIndex === idx ? null : idx;
	}

	$: isNight = $isNightAtLocationStore;

	// Helper for UV risk color (copied from UVAirQualityStrip)
	function getUVColor(uv: number) {
		if (uv < 3) return 'bg-green-200 text-green-900';
		if (uv < 6) return 'bg-yellow-200 text-yellow-900';
		if (uv < 8) return 'bg-orange-200 text-orange-900';
		if (uv < 11) return 'bg-red-200 text-red-900';
		return 'bg-purple-200 text-purple-900';
	}

	// Wardrobe prose suggestion logic (boilerplate, not a carousel)
	$: wardrobeProse = (() => {
		if (!weather?.current?.temperature_2m) return '';
		const temp = weather.current.temperature_2m;
		const locale = $currentLocale;
		let icon = '👕', item = '', reason = '';
		if (temp > 25) {
			icon = '👕';
			item = locale === 'de' ? 'Leichte Sommerklamotten' : $t.lightBreathableClothing;
			reason = locale === 'de' ? 'Die Sonne brennt – gönn dir etwas Luftiges, damit du cool bleibst.' : $t.lightBreathableReason;
		} else if (temp > 15) {
			icon = '🧥';
			item = locale === 'de' ? 'Leichte Jacke im Zwiebel-Look' : $t.lightJacketJeans;
			reason = locale === 'de' ? 'Das klassische "Zwiebel-Look"-Wetter: morgens frisch, nachmittags mild.' : $t.lightJacketReason;
		} else if (temp > 5) {
			icon = '🧶';
			item = locale === 'de' ? 'Kuschelpullover & warme Hose' : $t.cozySweaterPants;
			reason = locale === 'de' ? 'Ein Hauch von Kälte – Zeit, dem inneren Faultier mit einem flauschigen Pulli zu huldigen.' : $t.cozySweaterReason;
		} else {
			icon = '🧥';
			item = locale === 'de' ? 'Dicker Wintermantel & Accessoires' : $t.winterCoatAccessories;
			reason = locale === 'de' ? 'Es ist bitterkalt – zieh alles an, was nicht bei drei auf dem Kleiderbügel ist!' : $t.winterCoatReason;
		}
		return `${icon} ${item}. ${reason}`;
	})();
</script>

<div class="weather-display">
	{#if weather}
		<!-- Current Weather Card -->
		<div class="glass-card-lg p-6 mb-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105 relative">
			<div class="flex flex-col items-start mb-2 gap-1">
				<div class="flex items-center gap-2">
					<span class="text-2xl">📍</span>
					<span class="text-lg font-semibold text-glass">{currentLocation}</span>
				</div>
				<div class="mt-1"><YesterdayComparisonBadge /></div>
			</div>
			<h2 class="text-2xl font-bold text-glass mb-4 flex items-center">
				<span class="mr-3"><AnimatedWeatherIcon code={weather.current.weather_code} isNight={isNight} /></span>
				{$t.currentWeather}
			</h2>
			<div class="grid grid-cols-2 md:grid-cols-4 gap-4 items-center">
				<div class="weather-stat relative">
					<div class="text-3xl font-bold text-blue-600 dark:text-blue-400">
						{weather.current.temperature_2m}°C
					</div>
					<div class="text-sm text-glass-muted">{$t.temperature}</div>
					{#if weather.current.apparent_temperature !== undefined}
						<!-- Feels-Like Delta Chip -->
						{#if Math.abs(weather.current.apparent_temperature - weather.current.temperature_2m) >= 1}
							<span class="delta-chip {weather.current.apparent_temperature > weather.current.temperature_2m ? 'warmer' : 'colder'}" aria-label="Feels-like temperature delta">
								{weather.current.apparent_temperature > weather.current.temperature_2m ? '↑' : '↓'}
								{Math.abs(weather.current.apparent_temperature - weather.current.temperature_2m).toFixed(1)}°C
								{weather.current.apparent_temperature > weather.current.temperature_2m ? $t.feelsWarmer : $t.feelsColder}
							</span>
						{/if}
					{/if}
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
			
			<div class="mt-2 p-3 glass-card rounded-glass">
				<div class="text-lg font-medium text-glass">
					{getWeatherDescription(weather.current.weather_code)}
				</div>
				{#if wardrobeProse}
					<div class="mt-3 text-base text-glass-secondary" aria-label="{$t.wardrobe} suggestion">
						{wardrobeProse}
					</div>
				{/if}
			</div>
		</div>

		<!-- Sunrise, UV, Sunset Card -->
		<div class="glass-card-lg p-4 mb-4 flex justify-between items-stretch text-lg text-glass-secondary gap-2">
			{#if weather?.daily?.sunrise && weather?.daily?.sunset}
				<div class="flex-1 flex flex-col items-center justify-center">
					<span>🌅</span>
					<span>{new Date(weather.daily.sunrise[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: $currentLocale !== 'de' })}</span>
				</div>
				<div class="flex-1 flex flex-col items-center justify-center">
					<div class={`chip ${getUVColor(weather.current.uv_index)} w-full justify-center`} style="max-width: 120px; min-height: 40px;" aria-label="UV Index">
						<span class="icon">☀️</span>
						<span class="label">UV</span>
						<span class="value">{weather.current.uv_index?.toFixed(1)}</span>
					</div>
				</div>
				<div class="flex-1 flex flex-col items-center justify-center">
					<span>🌇</span>
					<span>{new Date(weather.daily.sunset[0]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: $currentLocale !== 'de' })}</span>
				</div>
			{/if}
		</div>

		<!-- 7-Day Forecast -->
		<div class="glass-card-lg p-4 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
			<h3 class="text-lg font-bold text-glass mb-2 flex items-center">
				<span class="text-xl mr-2">📅</span>
				{$t.sevenDayForecast}
			</h3>
			<div class="seven-day-row flex flex-row gap-2 justify-between items-stretch overflow-x-auto">
				{#each weather.daily.time as date, index}
					<div on:click={() => handleDayClick(index)} style="cursor:pointer;">
						<ExpandableDayRow {index} {weather} />
					</div>
				{/each}
			</div>
		</div>

		{#if expandedIndex !== null}
			<div class="glass-card p-4 mt-2 rounded-glass">
				<div class="font-semibold text-glass mb-2">{formatDate(weather.daily.time[expandedIndex])}</div>
				<div class="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-glass-secondary">
					<div><span class="font-semibold">{$t.windSpeed}:</span> {weather.daily.wind_speed_10m_max[expandedIndex]} km/h</div>
					<div><span class="font-semibold">{$t.precipitation}:</span> {weather.daily.precipitation_sum[expandedIndex]} mm</div>
					<div class="font-semibold">🌅 Sunrise:</div>
					<div>{new Date(weather.daily.sunrise[expandedIndex]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: $currentLocale !== 'de' })}</div>
					<div class="font-semibold">🌇 Sunset:</div>
					<div>{new Date(weather.daily.sunset[expandedIndex]).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: $currentLocale !== 'de' })}</div>
					<div class="col-span-2 md:col-span-4 mt-2"><span class="font-semibold">{$t.temperature}:</span> {weather.daily.temperature_2m_max[expandedIndex]}° / {weather.daily.temperature_2m_min[expandedIndex]}°</div>
					<div class="col-span-2 md:col-span-4"><span class="font-semibold">{$t.currentWeather}:</span> {getWeatherDescription(weather.daily.weather_code[expandedIndex])}</div>
				</div>
			</div>
		{/if}
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
	.glass-card:focus-visible,
	.glass-card-lg:focus-visible {
		outline: 2px solid #38bdf8;
		outline-offset: 2px;
		box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
	}
	.text-glass, .text-glass-muted, .text-glass-secondary {
		text-shadow: 0 1px 2px rgba(0,0,0,0.08), 0 0px 1px rgba(0,0,0,0.12);
	}
	.delta-chip {
		display: inline-flex;
		align-items: center;
		gap: 0.25em;
		font-size: 0.95em;
		font-weight: 600;
		border-radius: 9999px;
		padding: 0.2em 0.7em;
		margin-top: 0.5em;
		margin-left: 0.2em;
		background: rgba(255,255,255,0.7);
		box-shadow: 0 1px 4px rgba(30,144,255,0.08);
	}
	.delta-chip.warmer {
		color: #e67e22;
		background: rgba(255, 215, 100, 0.18);
	}
	.delta-chip.colder {
		color: #3498db;
		background: rgba(100, 180, 255, 0.18);
	}
	.seven-day-row {
		display: flex;
		flex-direction: row;
		gap: 0.5rem;
		justify-content: space-between;
		align-items: stretch;
		overflow-x: auto;
		margin-bottom: 0.5rem;
	}
	.chip {
		display: flex;
		align-items: center;
		gap: 0.5em;
		border-radius: 9999px;
		padding: 0.4em 1.1em;
		font-weight: 600;
		font-size: 1em;
		box-shadow: 0 1px 4px rgba(30,144,255,0.08);
		min-width: 90px;
		justify-content: center;
	}
	.icon {
		font-size: 1.2em;
	}
	.label {
		font-size: 0.95em;
		opacity: 0.7;
	}
	.value {
		font-size: 1.1em;
		margin-left: 0.2em;
	}
</style> 