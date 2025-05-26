<script lang="ts">
	import type { WeatherData } from '../stores/weather';

	export let weather: WeatherData | null;

	interface ActivityItem {
		activity: string;
		icon: string;
		reason: string;
		location: 'indoor' | 'outdoor' | 'both';
	}

	function getActivitySuggestions(temp: number, precipitation: number, windSpeed: number, weatherCode: number): ActivityItem[] {
		const suggestions: ActivityItem[] = [];

		// Clear weather activities
		if (precipitation === 0 && temp > 15 && windSpeed < 20) {
			suggestions.push({
				activity: 'Picnic in the park',
				icon: '🧺',
				reason: 'Perfect weather for outdoor dining',
				location: 'outdoor',
			});
			suggestions.push({
				activity: 'Hiking',
				icon: '🥾',
				reason: 'Great conditions for nature walks',
				location: 'outdoor',
			});
			suggestions.push({
				activity: 'Outdoor photography',
				icon: '📸',
				reason: 'Good lighting and visibility',
				location: 'outdoor',
			});
		}

		// Hot weather activities
		if (temp > 25) {
			suggestions.push({
				activity: 'Swimming',
				icon: '🏊',
				reason: 'Cool off in hot weather',
				location: 'outdoor',
			});
			suggestions.push({
				activity: 'Beach visit',
				icon: '🏖️',
				reason: 'Perfect beach weather',
				location: 'outdoor',
			});
			suggestions.push({
				activity: 'Ice cream shop',
				icon: '🍦',
				reason: 'Treat yourself to something cold',
				location: 'both',
			});
		}

		// Rainy weather activities
		if (precipitation > 0) {
			suggestions.push({
				activity: 'Museum visit',
				icon: '🏛️',
				reason: 'Stay dry while learning',
				location: 'indoor',
			});
			suggestions.push({
				activity: 'Board games',
				icon: '🎲',
				reason: 'Fun indoor entertainment',
				location: 'indoor',
			});
			suggestions.push({
				activity: 'Movie theater',
				icon: '🎬',
				reason: 'Perfect rainy day activity',
				location: 'indoor',
			});
			suggestions.push({
				activity: 'Cozy café',
				icon: '☕',
				reason: 'Warm up with a hot drink',
				location: 'indoor',
			});
		}

		// Cold weather activities
		if (temp < 5) {
			suggestions.push({
				activity: 'Indoor shopping',
				icon: '🛍️',
				reason: 'Stay warm while browsing',
				location: 'indoor',
			});
			suggestions.push({
				activity: 'Library visit',
				icon: '📚',
				reason: 'Warm, quiet environment',
				location: 'indoor',
			});
			if (precipitation > 0 && temp < 0) {
				suggestions.push({
					activity: 'Winter sports',
					icon: '⛷️',
					reason: 'Great conditions for skiing',
					location: 'outdoor',
				});
			}
		}

		// Moderate weather activities
		if (temp >= 10 && temp <= 25 && precipitation === 0) {
			suggestions.push({
				activity: 'City walking tour',
				icon: '🚶',
				reason: 'Comfortable temperature for walking',
				location: 'outdoor',
			});
			suggestions.push({
				activity: 'Outdoor market',
				icon: '🛒',
				reason: 'Pleasant weather for shopping',
				location: 'outdoor',
			});
		}

		// Windy weather activities
		if (windSpeed > 15 && precipitation === 0) {
			suggestions.push({
				activity: 'Kite flying',
				icon: '🪁',
				reason: 'Perfect wind conditions',
				location: 'outdoor',
			});
		}

		// Always include some general activities
		suggestions.push({
			activity: 'Reading',
			icon: '📖',
			reason: 'Good for any weather',
			location: 'indoor',
		});

		suggestions.push({
			activity: 'Cooking',
			icon: '👨‍🍳',
			reason: 'Create something delicious',
			location: 'indoor',
		});

		// Remove duplicates and limit to 6 suggestions
		const uniqueSuggestions = suggestions.filter((item, index, self) => 
			index === self.findIndex(t => t.activity === item.activity)
		);

		return uniqueSuggestions.slice(0, 6);
	}

	function getLocationColor(location: string): string {
		switch (location) {
			case 'outdoor': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
			case 'indoor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
			case 'both': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
		}
	}

	$: activitySuggestions = weather 
		? getActivitySuggestions(
			weather.current.temperature_2m,
			weather.current.precipitation,
			weather.current.wind_speed_10m,
			weather.current.weather_code
		)
		: [];
</script>

<div class="activity-suggestions">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
			<span class="text-2xl mr-3">🎯</span>
			Activity Suggestions
		</h2>

		{#if activitySuggestions.length > 0}
			<div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
				{#each activitySuggestions as suggestion}
					<div class="suggestion-card bg-blue-50 dark:bg-blue-900/20 rounded-md p-2 md:p-3 flex items-center gap-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors hover:scale-105 transform duration-200">
						<span class="text-xl md:text-2xl">{suggestion.icon}</span>
						<div class="flex-1">
							<div class="font-semibold text-blue-900 dark:text-blue-100 text-sm md:text-base mb-0.5">
								{suggestion.activity}
							</div>
							<div class="text-xs text-blue-700 dark:text-blue-300 leading-tight mb-0.5">
								{suggestion.reason}
							</div>
							<span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full {getLocationColor(suggestion.location)}">
								{suggestion.location}
							</span>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8">
				<div class="text-gray-400 text-4xl mb-3">🎪</div>
				<p class="text-gray-600 dark:text-gray-400">
					No weather data available for activity suggestions
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