<script lang="ts">
	import type { WeatherData } from '../stores/weather';
	import { getWeatherTheme } from '../utils/weatherThemes';

	export let weather: WeatherData | null;

	$: currentTheme = getWeatherTheme(weather?.current?.weather_code);
	$: backgroundClass = `min-h-screen transition-all duration-1000 ease-in-out ${currentTheme.background}`;
</script>

<div 
	class={backgroundClass}
	role="presentation"
	aria-label="Weather-reactive background showing {currentTheme.name} conditions"
>
	<slot />
</div>

<style>
	/* Additional smooth transition effects */
	div {
		background-attachment: fixed;
		background-size: cover;
		background-position: center;
	}

	/* Subtle animation for weather transitions */
	@keyframes weather-fade {
		0% { opacity: 0.8; }
		50% { opacity: 1; }
		100% { opacity: 0.8; }
	}

	div:global(.weather-transition) {
		animation: weather-fade 3s ease-in-out infinite;
	}
</style> 