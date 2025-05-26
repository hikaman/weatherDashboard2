<script lang="ts">
	import type { WeatherData } from '../stores/weather';

	export let weather: WeatherData | null;

	interface Suggestion {
		category: string;
		icon: string;
		item: string;
		reason: string;
		type: string;
	}

	function getUnifiedSuggestions(temp: number, precipitation: number, windSpeed: number): Suggestion[] {
		const suggestions: Suggestion[] = [];

		// Wardrobe suggestion
		if (temp > 25) {
			suggestions.push({
				category: 'Wardrobe',
				icon: '👕',
				item: 'Light, breathable clothing',
				reason: 'Perfect weather for staying cool and comfortable in light fabrics.',
				type: 'wardrobe'
			});
		} else if (temp > 15) {
			suggestions.push({
				category: 'Wardrobe',
				icon: '🧥',
				item: 'Light jacket and jeans',
				reason: 'Ideal layering weather - comfortable and adaptable to temperature changes.',
				type: 'wardrobe'
			});
		} else if (temp > 5) {
			suggestions.push({
				category: 'Wardrobe',
				icon: '🧶',
				item: 'Cozy sweater and warm pants',
				reason: 'Bundle up in something warm and comfortable for this cooler weather.',
				type: 'wardrobe'
			});
		} else {
			suggestions.push({
				category: 'Wardrobe',
				icon: '🧥',
				item: 'Winter coat and accessories',
				reason: 'Layer up well - cold enough that you will appreciate the extra warmth.',
				type: 'wardrobe'
			});
		}

		// Food suggestion
		if (temp > 25) {
			suggestions.push({
				category: 'Food',
				icon: '🥗',
				item: 'Fresh salad or cold soup',
				reason: 'Light, refreshing meals are perfect for staying energized in warm weather.',
				type: 'food'
			});
		} else if (temp > 15) {
			suggestions.push({
				category: 'Food',
				icon: '🥪',
				item: 'Sandwich or light meal',
				reason: 'Great weather for outdoor eating or a satisfying, balanced meal.',
				type: 'food'
			});
		} else if (temp > 5) {
			suggestions.push({
				category: 'Food',
				icon: '🍲',
				item: 'Warm soup or stew',
				reason: 'Nothing beats a hearty, warming meal when the weather turns cooler.',
				type: 'food'
			});
		} else {
			suggestions.push({
				category: 'Food',
				icon: '☕',
				item: 'Hot drinks and comfort food',
				reason: 'Warm up from the inside with comforting hot meals and beverages.',
				type: 'food'
			});
		}

		// Activity suggestion
		if (precipitation > 5) {
			suggestions.push({
				category: 'Activity',
				icon: '🏛️',
				item: 'Indoor activities',
				reason: 'Perfect weather for museums, cafes, or cozy indoor entertainment.',
				type: 'activity'
			});
		} else if (temp > 20 && windSpeed < 15) {
			suggestions.push({
				category: 'Activity',
				icon: '🌳',
				item: 'Outdoor adventures',
				reason: 'Beautiful conditions for hiking, picnics, or exploring nature.',
				type: 'activity'
			});
		} else if (temp > 10) {
			suggestions.push({
				category: 'Activity',
				icon: '🚶',
				item: 'Light outdoor activities',
				reason: 'Great weather for walking, light exercise, or outdoor markets.',
				type: 'activity'
			});
		} else {
			suggestions.push({
				category: 'Activity',
				icon: '🏠',
				item: 'Cozy indoor time',
				reason: 'Perfect weather for staying warm indoors with books, movies, or hobbies.',
				type: 'activity'
			});
		}

		// Exercise suggestion
		if (temp > 25) {
			suggestions.push({
				category: 'Exercise',
				icon: '🏊',
				item: 'Swimming or water activities',
				reason: 'Beat the heat with refreshing water-based exercise and activities.',
				type: 'exercise'
			});
		} else if (temp > 15 && precipitation < 2) {
			suggestions.push({
				category: 'Exercise',
				icon: '🚴',
				item: 'Cycling or jogging',
				reason: 'Perfect conditions for energizing outdoor cardio and fresh air.',
				type: 'exercise'
			});
		} else if (temp > 5) {
			suggestions.push({
				category: 'Exercise',
				icon: '🚶',
				item: 'Brisk walking',
				reason: 'Great weather for a refreshing walk to get your blood flowing.',
				type: 'exercise'
			});
		} else {
			suggestions.push({
				category: 'Exercise',
				icon: '🧘',
				item: 'Indoor yoga or stretching',
				reason: 'Stay active and warm with gentle indoor movement and mindfulness.',
				type: 'exercise'
			});
		}

		return suggestions;
	}

	function getCategoryColor(type: string): string {
		const colors: Record<string, string> = {
			'wardrobe': 'bg-purple-500/20 dark:bg-purple-600/30 border-purple-300/50 dark:border-purple-500/50',
			'food': 'bg-orange-500/20 dark:bg-orange-600/30 border-orange-300/50 dark:border-orange-500/50',
			'activity': 'bg-blue-500/20 dark:bg-blue-600/30 border-blue-300/50 dark:border-blue-500/50',
			'exercise': 'bg-green-500/20 dark:bg-green-600/30 border-green-300/50 dark:border-green-500/50'
		};
		return colors[type] || 'bg-gray-500/20 dark:bg-gray-600/30 border-gray-300/50 dark:border-gray-500/50';
	}

	$: unifiedSuggestions = weather 
		? getUnifiedSuggestions(
			weather.current.temperature_2m,
			weather.current.precipitation,
			weather.current.wind_speed_10m
		)
		: [];
</script>

<div class="unified-suggestions">
	<div class="glass-card-lg p-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
		<h2 class="text-xl font-bold text-glass mb-6 flex items-center">
			<span class="text-2xl mr-3">💡</span>
			Smart Suggestions
		</h2>

		{#if unifiedSuggestions.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each unifiedSuggestions as suggestion}
					<div class="glass-card p-4 border {getCategoryColor(suggestion.type)} hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 hover:scale-105">
						<div class="flex items-start gap-3">
							<span class="text-3xl flex-shrink-0">{suggestion.icon}</span>
							<div class="flex-1 min-w-0">
								<div class="text-xs font-medium text-glass-muted uppercase tracking-wide mb-1">
									{suggestion.category}
								</div>
								<div class="font-semibold text-glass text-base mb-2">
									{suggestion.item}
								</div>
								<div class="text-sm text-glass-secondary leading-relaxed">
									{suggestion.reason}
								</div>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8">
				<div class="text-glass-muted text-4xl mb-3">🌤️</div>
				<p class="text-glass-secondary">
					No weather data available for suggestions
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	.glass-card:hover {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
</style> 