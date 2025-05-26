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

		// Temperature-based suggestions with humanized content
		if (temp > 25) {
			suggestions.push({
				item: 'Light T-shirt',
				icon: '👕',
				reason: 'It\'s quite warm today, so breathable fabrics will keep you comfortable and cool.',
			});
			suggestions.push({
				item: 'Shorts',
				icon: '🩳',
				reason: 'Perfect weather for showing off those summer vibes and staying comfortable.',
			});
			suggestions.push({
				item: 'Sunglasses',
				icon: '🕶️',
				reason: 'The sun will be bright today, so protect your eyes and look stylish doing it.',
			});
		} else if (temp > 15) {
			suggestions.push({
				item: 'Light jacket',
				icon: '🧥',
				reason: 'The temperature is just right for layering - you can always take it off if it warms up.',
			});
			suggestions.push({
				item: 'Comfortable jeans',
				icon: '👖',
				reason: 'Perfect weather for your favorite pair of jeans and a relaxed day out.',
			});
		} else if (temp > 5) {
			suggestions.push({
				item: 'Cozy sweater',
				icon: '🧶',
				reason: 'It\'s getting chilly, so wrap yourself in something warm and comfortable.',
			});
			suggestions.push({
				item: 'Long pants',
				icon: '👖',
				reason: 'Keep your legs warm and cozy with full coverage for this cooler weather.',
			});
		} else {
			suggestions.push({
				item: 'Warm winter coat',
				icon: '🧥',
				reason: 'Bundle up well today - it\'s cold enough that you\'ll really appreciate the extra warmth.',
			});
			suggestions.push({
				item: 'Warm hat',
				icon: '🧢',
				reason: 'Don\'t forget to cover your head - you lose a lot of heat that way.',
			});
			suggestions.push({
				item: 'Gloves',
				icon: '🧤',
				reason: 'Your hands will thank you for keeping them warm and protected from the cold.',
			});
		}

		// Precipitation-based suggestions
		if (precipitation > 0) {
			suggestions.push({
				item: 'Umbrella',
				icon: '☂️',
				reason: 'Rain is expected, so grab an umbrella to stay dry and comfortable.',
			});
			suggestions.push({
				item: 'Raincoat',
				icon: '🧥',
				reason: 'A good raincoat will keep you dry and let you enjoy the day despite the weather.',
			});
			suggestions.push({
				item: 'Waterproof shoes',
				icon: '👢',
				reason: 'Keep your feet dry and avoid soggy socks with some waterproof footwear.',
			});
		}

		// Wind-based suggestions
		if (windSpeed > 20) {
			suggestions.push({
				item: 'Windbreaker',
				icon: '🧥',
				reason: 'It\'s quite breezy today, so a windbreaker will help you stay comfortable outdoors.',
			});
		}

		// Always include footwear if not already suggested
		if (!suggestions.some(s => s.item.includes('shoes') || s.item.includes('boots'))) {
			if (temp > 20) {
				suggestions.push({
					item: 'Sandals',
					icon: '👡',
					reason: 'Perfect weather for letting your feet breathe and staying comfortable.',
				});
			} else {
				suggestions.push({
					item: 'Comfortable shoes',
					icon: '👟',
					reason: 'A good pair of shoes will keep you comfortable whatever the day brings.',
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
	<div class="glass-card-lg p-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
		<h2 class="text-xl font-bold text-glass mb-4 flex items-center">
			<span class="text-2xl mr-3">👗</span>
			Wardrobe Suggestions
		</h2>

		{#if wardrobeSuggestions.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
				{#each wardrobeSuggestions as suggestion}
					<div class="glass-card p-3 md:p-4 flex items-start gap-3 hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 hover:scale-105">
						<span class="text-2xl md:text-3xl flex-shrink-0">{suggestion.icon}</span>
						<div class="flex-1 min-w-0">
							<div class="font-semibold text-glass text-sm md:text-base mb-1">
								{suggestion.item}
							</div>
							<div class="text-xs md:text-sm text-glass-secondary leading-relaxed">
								{suggestion.reason}
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8">
				<div class="text-glass-muted text-4xl mb-3">👔</div>
				<p class="text-glass-secondary">
					No weather data available for wardrobe suggestions
				</p>
			</div>
		{/if}
	</div>
</div>

<style>
	/* Enhanced glassmorphism effects for wardrobe suggestions */
	.glass-card:hover {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
	
	/* Improved text readability on glass backgrounds */
	.text-glass-secondary {
		line-height: 1.4;
	}
</style> 