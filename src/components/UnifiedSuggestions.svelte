<script lang="ts">
	import type { WeatherData } from '../stores/weather';
	import { t } from '../lib/i18n';

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
				category: $t.wardrobe,
				icon: '👕',
				item: $t.lightBreathableClothing,
				reason: $t.lightBreathableReason,
				type: 'wardrobe'
			});
		} else if (temp > 15) {
			suggestions.push({
				category: $t.wardrobe,
				icon: '🧥',
				item: $t.lightJacketJeans,
				reason: $t.lightJacketReason,
				type: 'wardrobe'
			});
		} else if (temp > 5) {
			suggestions.push({
				category: $t.wardrobe,
				icon: '🧶',
				item: $t.cozySweaterPants,
				reason: $t.cozySweaterReason,
				type: 'wardrobe'
			});
		} else {
			suggestions.push({
				category: $t.wardrobe,
				icon: '🧥',
				item: $t.winterCoatAccessories,
				reason: $t.winterCoatReason,
				type: 'wardrobe'
			});
		}

		// Food suggestion
		if (temp > 25) {
			suggestions.push({
				category: $t.food,
				icon: '🥗',
				item: $t.freshSaladColdSoup,
				reason: $t.freshSaladReason,
				type: 'food'
			});
		} else if (temp > 15) {
			suggestions.push({
				category: $t.food,
				icon: '🥪',
				item: $t.sandwichLightMeal,
				reason: $t.sandwichReason,
				type: 'food'
			});
		} else if (temp > 5) {
			suggestions.push({
				category: $t.food,
				icon: '🍲',
				item: $t.warmSoupStew,
				reason: $t.warmSoupReason,
				type: 'food'
			});
		} else {
			suggestions.push({
				category: $t.food,
				icon: '☕',
				item: $t.hotDrinksComfortFood,
				reason: $t.hotDrinksReason,
				type: 'food'
			});
		}

		// Activity suggestion
		if (precipitation > 5) {
			suggestions.push({
				category: $t.activity,
				icon: '🏛️',
				item: $t.indoorActivities,
				reason: $t.indoorActivitiesReason,
				type: 'activity'
			});
		} else if (temp > 20 && windSpeed < 15) {
			suggestions.push({
				category: $t.activity,
				icon: '🌳',
				item: $t.outdoorAdventures,
				reason: $t.outdoorAdventuresReason,
				type: 'activity'
			});
		} else if (temp > 10) {
			suggestions.push({
				category: $t.activity,
				icon: '🚶',
				item: $t.lightOutdoorActivities,
				reason: $t.lightOutdoorReason,
				type: 'activity'
			});
		} else {
			suggestions.push({
				category: $t.activity,
				icon: '🏠',
				item: $t.cozyIndoorTime,
				reason: $t.cozyIndoorReason,
				type: 'activity'
			});
		}

		// Exercise suggestion
		if (temp > 25) {
			suggestions.push({
				category: $t.exercise,
				icon: '🏊',
				item: $t.swimmingWaterActivities,
				reason: $t.swimmingReason,
				type: 'exercise'
			});
		} else if (temp > 15 && precipitation < 2) {
			suggestions.push({
				category: $t.exercise,
				icon: '🚴',
				item: $t.cyclingJogging,
				reason: $t.cyclingReason,
				type: 'exercise'
			});
		} else if (temp > 5) {
			suggestions.push({
				category: $t.exercise,
				icon: '🚶',
				item: $t.briskWalking,
				reason: $t.briskWalkingReason,
				type: 'exercise'
			});
		} else {
			suggestions.push({
				category: $t.exercise,
				icon: '🧘',
				item: $t.indoorYogaStretching,
				reason: $t.indoorYogaReason,
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
			{$t.smartSuggestions}
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
					{$t.noSuggestionsData}
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