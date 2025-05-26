<script lang="ts">
	import type { WeatherData } from '../stores/weather';

	export let weather: WeatherData | null;

	interface WardrobeItem {
		item: string;
		icon: string;
		reason: string;
	}

	function getWardrobeSuggestions(temp: number, precipitation: number, windSpeed: number): WardrobeItem[] {
		const suggestions: WardrobeItem[] = [];

		// Temperature-based suggestions
		if (temp > 25) {
			suggestions.push({
				item: 'T-shirt',
				icon: '👕',
				reason: 'Hot weather - stay cool',
			});
			suggestions.push({
				item: 'Shorts',
				icon: '🩳',
				reason: 'Perfect for warm days',
			});
			suggestions.push({
				item: 'Sunglasses',
				icon: '🕶️',
				reason: 'Protect your eyes',
			});
		} else if (temp > 15) {
			suggestions.push({
				item: 'Light jacket',
				icon: '🧥',
				reason: 'Mild temperature',
			});
			suggestions.push({
				item: 'Jeans',
				icon: '👖',
				reason: 'Comfortable for moderate weather',
			});
		} else if (temp > 5) {
			suggestions.push({
				item: 'Sweater',
				icon: '🧶',
				reason: 'Keep warm in cool weather',
			});
			suggestions.push({
				item: 'Long pants',
				icon: '👖',
				reason: 'Cover up for cooler temps',
			});
		} else {
			suggestions.push({
				item: 'Winter coat',
				icon: '🧥',
				reason: 'Essential for cold weather',
			});
			suggestions.push({
				item: 'Warm hat',
				icon: '🧢',
				reason: 'Prevent heat loss',
			});
			suggestions.push({
				item: 'Gloves',
				icon: '🧤',
				reason: 'Keep hands warm',
			});
		}

		// Precipitation-based suggestions
		if (precipitation > 0) {
			suggestions.push({
				item: 'Umbrella',
				icon: '☂️',
				reason: 'Stay dry in the rain',
			});
			suggestions.push({
				item: 'Raincoat',
				icon: '🧥',
				reason: 'Waterproof protection',
			});
			suggestions.push({
				item: 'Waterproof shoes',
				icon: '👢',
				reason: 'Keep feet dry',
			});
		}

		// Wind-based suggestions
		if (windSpeed > 20) {
			suggestions.push({
				item: 'Windbreaker',
				icon: '🧥',
				reason: 'Protection from strong winds',
			});
		}

		// Always include footwear if not already suggested
		if (!suggestions.some(s => s.item.includes('shoes') || s.item.includes('boots'))) {
			if (temp > 20) {
				suggestions.push({
					item: 'Sandals',
					icon: '👡',
					reason: 'Comfortable for warm weather',
				});
			} else {
				suggestions.push({
					item: 'Comfortable shoes',
					icon: '👟',
					reason: 'Good for walking',
				});
			}
		}

		return suggestions;
	}

	$: wardrobeSuggestions = weather 
		? getWardrobeSuggestions(
			weather.current.temperature_2m,
			weather.current.precipitation,
			weather.current.wind_speed_10m
		)
		: [];
</script>

<div class="wardrobe-suggestions">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
			<span class="text-2xl mr-3">👗</span>
			Wardrobe Suggestions
		</h2>

		{#if wardrobeSuggestions.length > 0}
			<div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
				{#each wardrobeSuggestions as suggestion}
					<div class="suggestion-card bg-purple-50 dark:bg-purple-900/20 rounded-md p-2 md:p-3 flex items-center gap-2 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors hover:scale-105 transform duration-200">
						<span class="text-xl md:text-2xl">{suggestion.icon}</span>
						<div class="flex-1">
							<div class="font-semibold text-purple-900 dark:text-purple-100 text-sm md:text-base">
								{suggestion.item}
							</div>
							<div class="text-xs text-purple-700 dark:text-purple-300 leading-tight">
								{suggestion.reason}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8">
				<div class="text-gray-400 text-4xl mb-3">👔</div>
				<p class="text-gray-600 dark:text-gray-400">
					No weather data available for wardrobe suggestions
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.suggestion-card:hover {
		@apply shadow-md;
	}
	.suggestion-card {
		@apply p-2 md:p-3;
	}
	.suggestion-card .text-xl {
		font-size: 1.25rem;
	}
	.suggestion-card .text-sm {
		font-size: 0.9rem;
	}
	.suggestion-card .text-xs {
		font-size: 0.75rem;
	}
</style> 