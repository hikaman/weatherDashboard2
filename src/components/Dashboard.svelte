<script lang="ts">
	import { onMount } from 'svelte';
	import { weatherStore, fetchWeatherData, getCurrentLocation, type WeatherData, loadWeatherCache } from '../stores/weather';
	import WeatherDisplay from './WeatherDisplay.svelte';
	import HourlyForecast from './HourlyForecast.svelte';
	import UnifiedSuggestions from './UnifiedSuggestions.svelte';
	import CitySearch from './CitySearch.svelte';
	import { t } from '../lib/i18n';
	import { lastCityStore } from '../stores/lastCity';
	import ForecastComparisonBox from './ForecastComparisonBox.svelte';
	import LanguageToggle from './LanguageToggle.svelte';
	import WeatherAlerts from './WeatherAlerts.svelte';
	import { checkWeatherAlerts } from '../stores/alerts';

	export let weather: WeatherData | null = null;

	let loading = false;
	let error: string | null = null;
	let usingCache = false;

	// Subscribe to weather store
	$: ({ data: weather, loading, error, currentLocation } = $weatherStore);

	// Load weather data on mount
	onMount(async () => {
		console.log('[Dashboard] onMount triggered.');
		if (!navigator.onLine) {
			const cached = loadWeatherCache();
			if (cached) {
				console.log('[Dashboard] Loaded weather data from cache:', cached);
				weatherStore.update((state) => ({
					...state,
					data: cached.data,
					currentLocation: cached.locationName,
					loading: false,
					error: null,
				}));
				usingCache = true;
				return;
			} else {
				console.log('[Dashboard] No cached weather data available.');
			}
		}
		if ($lastCityStore) {
			console.log('[Dashboard] Fetching weather data for last city:', $lastCityStore);
			await fetchWeatherData($lastCityStore.latitude, $lastCityStore.longitude, $lastCityStore.name);
			return;
		}
		// Try to get user's current location
		const location = await getCurrentLocation();
		if (location) {
			console.log('[Dashboard] Fetched current location:', location);
			await fetchWeatherData(location.latitude, location.longitude);
		} else {
			console.log('[Dashboard] Location access denied or unavailable. Defaulting to London.');
			await fetchWeatherData(51.5074, -0.1278);
		}
	});
</script>

<div class="dashboard">
	<div class="container mx-auto px-4 py-8">
		<WeatherAlerts />
		<!-- Loading State -->
		{#if loading}
			<div class="glass-card-lg p-8 text-center">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<span class="text-glass">{$t.loading}</span>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="glass-card-lg p-8 text-center">
				<div class="text-red-500 text-4xl mb-4">⚠️</div>
				<h3 class="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
					{$t.weatherDataUnavailable}
				</h3>
				<p class="text-red-600 dark:text-red-400 text-sm">
					{error}
				</p>
			</div>
		{:else}
			<!-- Main Dashboard Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Weather Display - Full width on mobile, left column on desktop -->
				<div class="lg:col-span-2">
					<WeatherDisplay {weather} {currentLocation} />
				</div>

				<!-- Forecast Comparison Box - Full width -->
				<div class="lg:col-span-2">
					<ForecastComparisonBox />
				</div>

				<!-- Hourly Forecast - Full width -->
				<div class="lg:col-span-2">
					<HourlyForecast {weather} />
				</div>

				<!-- Unified Suggestions -->
				<div class="lg:col-span-2">
					<UnifiedSuggestions {weather} />
				</div>
			</div>

			{#if usingCache}
				<div class="glass-card-lg p-4 text-center mb-4">
					<span class="text-yellow-600 dark:text-yellow-300">Offline: Showing cached weather data.</span>
				</div>
			{/if}
		{/if}
	</div>
</div>

<style>
	.container {
		max-width: 1200px;
	}

	/* Enhanced glassmorphism effects for dashboard */
	:global(.glass-card:hover),
	:global(.glass-card-lg:hover) {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
</style> 