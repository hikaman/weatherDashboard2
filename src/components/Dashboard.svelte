<script lang="ts">
	import { onMount } from 'svelte';
	import { weatherStore, fetchWeatherData, getCurrentLocation, type WeatherData } from '../stores/weather';
	import WeatherDisplay from './WeatherDisplay.svelte';
	import HourlyForecast from './HourlyForecast.svelte';
	import WardrobeSuggestions from './WardrobeSuggestions.svelte';
	import ActivitySuggestions from './ActivitySuggestions.svelte';
	import FoodSuggestions from './FoodSuggestions.svelte';
	import ExerciseSuggestions from './ExerciseSuggestions.svelte';
	import CitySearch from './CitySearch.svelte';

	export let weather: WeatherData | null = null;

	let loading = false;
	let error: string | null = null;

	// Subscribe to weather store
	$: ({ data: weather, loading, error } = $weatherStore);

	// Load weather data on mount
	onMount(async () => {
		// Try to get user's current location
		const location = await getCurrentLocation();
		if (location) {
			await fetchWeatherData(location.latitude, location.longitude);
		} else {
			// Default to a major city (London) if location access is denied
			await fetchWeatherData(51.5074, -0.1278);
		}
	});
</script>

<div class="dashboard">
	<div class="container mx-auto px-4 py-8">
		<!-- Header -->
		<header class="text-center mb-8">
			<h1 class="text-4xl font-bold text-glass mb-2">
				WeatherWise Dashboard
			</h1>
			<p class="text-glass-secondary">
				Smart suggestions based on current weather conditions
			</p>
		</header>

		<!-- Loading State -->
		{#if loading}
			<div class="glass-card-lg p-8 text-center">
				<div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
				<span class="text-glass">Loading weather data...</span>
			</div>
		{:else if error}
			<!-- Error State -->
			<div class="glass-card-lg p-8 text-center">
				<div class="text-red-500 text-4xl mb-4">⚠️</div>
				<h3 class="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
					Weather Data Unavailable
				</h3>
				<p class="text-red-600 dark:text-red-400 text-sm">
					{error}
				</p>
			</div>
		{:else}
			<!-- City Search -->
			<div class="mb-8">
				<CitySearch />
			</div>

			<!-- Main Dashboard Grid -->
			<div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
				<!-- Weather Display - Full width on mobile, left column on desktop -->
				<div class="lg:col-span-2">
					<WeatherDisplay {weather} />
				</div>

				<!-- Hourly Forecast - Full width -->
				<div class="lg:col-span-2">
					<HourlyForecast {weather} />
				</div>

				<!-- Suggestion Cards Grid -->
				<div class="space-y-8">
					<WardrobeSuggestions {weather} />
					<ActivitySuggestions {weather} />
				</div>

				<div class="space-y-8">
					<FoodSuggestions {weather} />
					<ExerciseSuggestions {weather} />
				</div>
			</div>
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