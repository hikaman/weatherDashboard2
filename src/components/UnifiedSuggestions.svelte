<script lang="ts">
	import type { WeatherData } from '../stores/weather';
	import { t, currentLocale } from '../lib/i18n';
	import { suggestionFilterStore, type SuggestionCategory } from '../stores/suggestionFilter';
	import SuggestionFilter from './SuggestionFilter.svelte';

	export let weather: WeatherData | null;

	interface Suggestion {
		category: string;
		icon: string;
		item: string;
		reason: string;
		type: string;
	}

	// Helper to pick a random element
	function pick<T>(arr: T[]): T {
		return arr[Math.floor(Math.random() * arr.length)];
	}

	function getUnifiedSuggestions(temp: number, precipitation: number, windSpeed: number): Suggestion[] {
		const suggestions: Suggestion[] = [];

		// Wardrobe suggestion mit deutscher Variation
		const locale = $currentLocale;
		if (temp > 25) {
			suggestions.push({
				category: $t.wardrobe,
				icon: '👕',
				item: locale === 'de' ? pick([
					'Leichte Sommerklamotten',
					'Luftiges Shirt und Shorts',
					'Kurze Hose & Tank-Top'
				]) : $t.lightBreathableClothing,
				reason: locale === 'de' ? pick([
					'Die Sonne brennt – gönn dir etwas Luftiges, damit du cool bleibst.',
					'Perfektes Wetter für leichte Stoffe und jede Menge Sonnencreme!',
					'Je weniger Stoff, desto mehr Sommer – genieße die Wärme!'
				]) : $t.lightBreathableReason,
				type: 'wardrobe'
			});
		} else if (temp > 15) {
			suggestions.push({
				category: $t.wardrobe,
				icon: '🧥',
				item: locale === 'de' ? pick([
					'Leichte Jacke im Zwiebel-Look',
					'Lieblings-Hoodie & Jeans',
					'Cardigan für den Zwiebel-Style'
				]) : $t.lightJacketJeans,
				reason: locale === 'de' ? pick([
					'Das klassische "Zwiebel-Look"-Wetter: morgens frisch, nachmittags mild.',
					'Eine Lage mehr schadet nicht – du kannst sie jederzeit abstreifen.',
					'Perfekt für flexible Outfits: Jacke an, Jacke aus, ganz wie du magst.'
				]) : $t.lightJacketReason,
				type: 'wardrobe'
			});
		} else if (temp > 5) {
			suggestions.push({
				category: $t.wardrobe,
				icon: '🧶',
				item: locale === 'de' ? pick([
					'Kuschelpullover & warme Hose',
					'Wollpulli mit Lieblingsjeans',
					'Gemütlicher Strick-Look'
				]) : $t.cozySweaterPants,
				reason: locale === 'de' ? pick([
					'Ein Hauch von Kälte – Zeit, dem inneren Faultier mit einem flauschigen Pulli zu huldigen.',
					'Ideal für heißen Tee und einen richtig gemütlichen Sweater.',
					'Kühl draußen? Kein Problem mit einer Extraportion Strick.'
				]) : $t.cozySweaterReason,
				type: 'wardrobe'
			});
		} else {
			suggestions.push({
				category: $t.wardrobe,
				icon: '🧥',
				item: locale === 'de' ? pick([
					'Dicker Wintermantel & Accessoires',
					'Puffer-Jacke plus Mütze',
					'Winterausrüstung komplett'
				]) : $t.winterCoatAccessories,
				reason: locale === 'de' ? pick([
					'Es ist bitterkalt – zieh alles an, was nicht bei drei auf dem Kleiderbügel ist!',
					'Eisbärenwetter! Pack dich ein und gönn dir eine extra Lage Flausch.',
					'Frostige Luft? Dann heißt es: Schal, Mütze, Handschuhe – das volle Programm.'
				]) : $t.winterCoatReason,
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

		// Activity suggestions – immer zwei Stück (aktiv & gemütlich-anspruchsvoll)
		// Aktiv
		suggestions.push({
			category: $t.activity,
			icon: '💪',
			item: locale === 'de'
				? pick([
					'Schwitz-Session im Fitnesspark',
					'Morgendlicher Power-Run',
					'After-Work Bike-Tour'
				])
				: $t.outdoorAdventures,
			reason: locale === 'de'
				? pick([
					'Bring dein Herz auf Touren – draußen wartet der Kalorienkiller!',
					'Perfekt, um die Endorphine tanzen zu lassen und dem Alltag davonzulaufen.',
					'Sonne, frische Luft, schnelle Beine – besser wird\'s nicht.'
				])
				: $t.outdoorAdventuresReason,
			type: 'activity'
		});

		// Gemütlich aber anspruchsvoll
		suggestions.push({
			category: $t.activity,
			icon: '🧩',
			item: locale === 'de'
				? pick([
					'Strategische Brettspielrunde im Café',
					'Escape-Room-Challenge',
					'Kreativer Barista-Workshop'
				])
				: $t.indoorActivities,
			reason: locale === 'de'
				? pick([
					'Gemütlich sitzen, Kopf rauchen lassen – genau das Richtige für clevere Füchse.',
					'Entspannt bleiben und trotzdem die grauen Zellen fordern – Challenge accepted!',
					'Ein Mix aus Chillen und Knobeln, der garantiert für Aha-Momente sorgt.'
				])
				: $t.indoorActivitiesReason,
			type: 'activity'
		});

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

		// --- E-Commerce Vorschläge pro Kategorie ----------------------------------
		const shopWardrobe = {
			category: $t.wardrobe,
			icon: '🛍️',
			item: locale === 'de' ? 'Jetzt passenden Look shoppen' : 'Shop the look',
			reason: locale === 'de'
				? 'Lust auf ein Upgrade? Klick dich durch unsere Kollektion und gönn deinem Style ein Fresh-Up.'
				: 'Spice up your wardrobe with our hand-picked pieces!',
			type: 'wardrobe'
		} as Suggestion;

		const shopFood = {
			category: $t.food,
			icon: '🍱',
			item: locale === 'de' ? 'Zutatenbox nach Hause' : 'Meal kit delivery',
			reason: locale === 'de'
				? 'Keine Lust auf Schleppen? Lass dir alles fix & fertig liefern – Kochspaß inklusive.'
				: 'Get fresh ingredients delivered straight to your door.',
			type: 'food'
		} as Suggestion;

		const shopActivity = {
			category: $t.activity,
			icon: '🎒',
			item: locale === 'de' ? 'Outdoor-Gear Check' : 'Gear up for adventure',
			reason: locale === 'de'
				? 'Dir fehlt noch die richtige Ausrüstung? Hol dir jetzt Helm, Schuhe & Co. im Sparpaket.'
				: 'Grab the gear you need for your next adventure at a discount.',
			type: 'activity'
		} as Suggestion;

		suggestions.push(shopWardrobe, shopFood, shopActivity);

		return suggestions;
	}

	function getCategoryColor(type: string): string {
		const colors: Record<string, string> = {
			'wardrobe': 'bg-purple-500/20 dark:bg-purple-600/30 border-purple-300/50 dark:border-purple-500/50',
			'food': 'bg-orange-500/20 dark:bg-orange-600/30 border-orange-300/50 dark:border-orange-500/50',
			'activity': 'bg-blue-500/20 dark:bg-blue-600/30 border-blue-300/50 dark:border-blue-500/50'
		};
		return colors[type] || 'bg-gray-500/20 dark:bg-gray-600/30 border-gray-300/50 dark:border-gray-500/50';
	}

	// Recompute suggestions whenever weather or locale changes
	$: unifiedSuggestions = weather && $t
		? getUnifiedSuggestions(
			weather.current.temperature_2m,
			weather.current.precipitation,
			weather.current.wind_speed_10m
		)
		: [];

	$: filter = $suggestionFilterStore;
</script>

<SuggestionFilter />

<div class="unified-suggestions">
	<div class="glass-card-lg p-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
		<h2 class="text-xl font-bold text-glass mb-6 flex items-center">
			<span class="text-2xl mr-3">💡</span>
			{$t.smartSuggestions}
		</h2>

		{#if unifiedSuggestions.length > 0}
			<div class="grid grid-cols-1 md:grid-cols-2 gap-4">
				{#each unifiedSuggestions as suggestion}
					{#if filter[suggestion.type as SuggestionCategory]}
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
					{/if}
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