<script lang="ts">
	import type { WeatherData } from '../stores/weather';

	export let weather: WeatherData | null;

	interface FoodItem {
		food: string;
		icon: string;
		reason: string;
		type: 'hot' | 'cold' | 'warm' | 'refreshing';
	}

	function getFoodSuggestions(temp: number, precipitation: number, windSpeed: number): FoodItem[] {
		const suggestions: FoodItem[] = [];

		// Hot weather foods
		if (temp > 25) {
			suggestions.push({
				food: 'Smoothie',
				icon: '🥤',
				reason: 'Cool and refreshing for hot weather',
				type: 'cold',
			});
			suggestions.push({
				food: 'Fruit salad',
				icon: '🥗',
				reason: 'Light and hydrating',
				type: 'refreshing',
			});
			suggestions.push({
				food: 'Ice cream',
				icon: '🍦',
				reason: 'Perfect treat for hot days',
				type: 'cold',
			});
			suggestions.push({
				food: 'Cold gazpacho',
				icon: '🍅',
				reason: 'Chilled soup for summer',
				type: 'cold',
			});
		}

		// Cold weather foods
		if (temp < 10) {
			suggestions.push({
				food: 'Hot stew',
				icon: '🍲',
				reason: 'Warm and hearty for cold weather',
				type: 'hot',
			});
			suggestions.push({
				food: 'Hot chocolate',
				icon: '☕',
				reason: 'Warm up from the inside',
				type: 'hot',
			});
			suggestions.push({
				food: 'Soup',
				icon: '🍜',
				reason: 'Comforting and warming',
				type: 'hot',
			});
			suggestions.push({
				food: 'Grilled cheese',
				icon: '🧀',
				reason: 'Warm comfort food',
				type: 'hot',
			});
		}

		// Rainy weather foods
		if (precipitation > 0) {
			suggestions.push({
				food: 'Hot tea',
				icon: '🍵',
				reason: 'Cozy drink for rainy days',
				type: 'hot',
			});
			suggestions.push({
				food: 'Pasta',
				icon: '🍝',
				reason: 'Comforting meal for staying in',
				type: 'warm',
			});
			suggestions.push({
				food: 'Baked goods',
				icon: '🥧',
				reason: 'Perfect for cozy indoor time',
				type: 'warm',
			});
		}

		// Moderate weather foods
		if (temp >= 15 && temp <= 25 && precipitation === 0) {
			suggestions.push({
				food: 'Salad',
				icon: '🥙',
				reason: 'Light and fresh for pleasant weather',
				type: 'refreshing',
			});
			suggestions.push({
				food: 'Sandwich',
				icon: '🥪',
				reason: 'Perfect for outdoor eating',
				type: 'warm',
			});
			suggestions.push({
				food: 'Grilled vegetables',
				icon: '🥒',
				reason: 'Great for outdoor cooking',
				type: 'warm',
			});
		}

		// Windy weather foods
		if (windSpeed > 20) {
			suggestions.push({
				food: 'Warm coffee',
				icon: '☕',
				reason: 'Warm drink for blustery conditions',
				type: 'hot',
			});
		}

		// Always include some general options
		suggestions.push({
			food: 'Fresh fruit',
			icon: '🍎',
			reason: 'Healthy choice for any weather',
			type: 'refreshing',
		});

		// Remove duplicates and limit to 6 suggestions
		const uniqueSuggestions = suggestions.filter((item, index, self) => 
			index === self.findIndex(t => t.food === item.food)
		);

		return uniqueSuggestions.slice(0, 6);
	}

	function getTypeColor(type: string): string {
		switch (type) {
			case 'hot': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
			case 'warm': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200';
			case 'cold': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
			case 'refreshing': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
		}
	}

	$: foodSuggestions = weather 
		? getFoodSuggestions(
			weather.current.temperature_2m,
			weather.current.precipitation,
			weather.current.wind_speed_10m
		)
		: [];
</script>

<div class="food-suggestions">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
			<span class="text-2xl mr-3">🍽️</span>
			Food Suggestions
		</h2>

		{#if foodSuggestions.length > 0}
			<div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
				{#each foodSuggestions as suggestion}
					<div class="suggestion-card bg-orange-50 dark:bg-orange-900/20 rounded-md p-2 md:p-3 flex items-center gap-2 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors hover:scale-105 transform duration-200">
						<span class="text-xl md:text-2xl">{suggestion.icon}</span>
						<div class="flex-1">
							<div class="font-semibold text-orange-900 dark:text-orange-100 text-sm md:text-base mb-0.5">
								{suggestion.food}
							</div>
							<div class="text-xs text-orange-700 dark:text-orange-300 leading-tight mb-0.5">
								{suggestion.reason}
							</div>
							<span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full {getTypeColor(suggestion.type)}">
								{suggestion.type}
							</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8">
				<div class="text-gray-400 text-4xl mb-3">🍴</div>
				<p class="text-gray-600 dark:text-gray-400">
					No weather data available for food suggestions
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