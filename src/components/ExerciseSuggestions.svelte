<script lang="ts">
	import type { WeatherData } from '../stores/weather';

	export let weather: WeatherData | null;

	interface ExerciseItem {
		exercise: string;
		icon: string;
		reason: string;
		location: 'indoor' | 'outdoor' | 'both';
		intensity: 'low' | 'moderate' | 'high';
	}

	function getExerciseSuggestions(temp: number, precipitation: number, windSpeed: number): ExerciseItem[] {
		const suggestions: ExerciseItem[] = [];

		// Clear weather outdoor exercises
		if (precipitation === 0 && temp > 10 && temp < 30 && windSpeed < 25) {
			suggestions.push({
				exercise: 'Jogging',
				icon: '🏃',
				reason: 'Perfect conditions for outdoor running',
				location: 'outdoor',
				intensity: 'moderate',
			});
			suggestions.push({
				exercise: 'Cycling',
				icon: '🚴',
				reason: 'Great weather for bike rides',
				location: 'outdoor',
				intensity: 'moderate',
			});
			suggestions.push({
				exercise: 'Walking',
				icon: '🚶',
				reason: 'Pleasant weather for a walk',
				location: 'outdoor',
				intensity: 'low',
			});
		}

		// Hot weather exercises
		if (temp > 25) {
			suggestions.push({
				exercise: 'Swimming',
				icon: '🏊',
				reason: 'Cool off while exercising',
				location: 'outdoor',
				intensity: 'moderate',
			});
			suggestions.push({
				exercise: 'Early morning yoga',
				icon: '🧘',
				reason: 'Exercise before it gets too hot',
				location: 'both',
				intensity: 'low',
			});
		}

		// Rainy weather indoor exercises
		if (precipitation > 0) {
			suggestions.push({
				exercise: 'Yoga',
				icon: '🧘',
				reason: 'Perfect indoor mindful exercise',
				location: 'indoor',
				intensity: 'low',
			});
			suggestions.push({
				exercise: 'Home workout',
				icon: '💪',
				reason: 'Stay active indoors',
				location: 'indoor',
				intensity: 'high',
			});
			suggestions.push({
				exercise: 'Stretching',
				icon: '🤸',
				reason: 'Gentle indoor movement',
				location: 'indoor',
				intensity: 'low',
			});
			suggestions.push({
				exercise: 'Dance workout',
				icon: '💃',
				reason: 'Fun indoor cardio',
				location: 'indoor',
				intensity: 'moderate',
			});
		}

		// Cold weather exercises
		if (temp < 5) {
			suggestions.push({
				exercise: 'Indoor gym',
				icon: '🏋️',
				reason: 'Stay warm while exercising',
				location: 'indoor',
				intensity: 'high',
			});
			suggestions.push({
				exercise: 'Hot yoga',
				icon: '🧘',
				reason: 'Warm up in heated environment',
				location: 'indoor',
				intensity: 'moderate',
			});
			if (precipitation > 0 && temp < 0) {
				suggestions.push({
					exercise: 'Winter sports',
					icon: '⛷️',
					reason: 'Great conditions for skiing',
					location: 'outdoor',
					intensity: 'high',
				});
			}
		}

		// Windy weather exercises
		if (windSpeed > 20) {
			suggestions.push({
				exercise: 'Indoor cardio',
				icon: '🏃',
				reason: 'Avoid strong winds',
				location: 'indoor',
				intensity: 'moderate',
			});
		}

		// Moderate weather exercises
		if (temp >= 15 && temp <= 25 && precipitation === 0 && windSpeed < 15) {
			suggestions.push({
				exercise: 'Outdoor fitness',
				icon: '🤸',
				reason: 'Perfect conditions for outdoor workouts',
				location: 'outdoor',
				intensity: 'moderate',
			});
			suggestions.push({
				exercise: 'Tennis',
				icon: '🎾',
				reason: 'Ideal weather for sports',
				location: 'outdoor',
				intensity: 'high',
			});
		}

		// Always include some general options
		suggestions.push({
			exercise: 'Meditation',
			icon: '🧘‍♀️',
			reason: 'Good for any weather',
			location: 'both',
			intensity: 'low',
		});

		// Remove duplicates and limit to 6 suggestions
		const uniqueSuggestions = suggestions.filter((item, index, self) => 
			index === self.findIndex(t => t.exercise === item.exercise)
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

	function getIntensityColor(intensity: string): string {
		switch (intensity) {
			case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
			case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
			case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
			default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
		}
	}

	$: exerciseSuggestions = weather 
		? getExerciseSuggestions(
			weather.current.temperature_2m,
			weather.current.precipitation,
			weather.current.wind_speed_10m
		)
		: [];
</script>

<div class="exercise-suggestions">
	<div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
		<h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
			<span class="text-2xl mr-3">💪</span>
			Exercise Suggestions
		</h2>

		{#if exerciseSuggestions.length > 0}
			<div class="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
				{#each exerciseSuggestions as suggestion}
					<div class="suggestion-card bg-green-50 dark:bg-green-900/20 rounded-md p-2 md:p-3 flex items-center gap-2 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors hover:scale-105 transform duration-200">
						<span class="text-xl md:text-2xl">{suggestion.icon}</span>
						<div class="flex-1">
							<div class="font-semibold text-green-900 dark:text-green-100 text-sm md:text-base mb-0.5">
								{suggestion.exercise}
							</div>
							<div class="text-xs text-green-700 dark:text-green-300 leading-tight mb-0.5">
								{suggestion.reason}
							</div>
							<div class="flex flex-wrap gap-1 mt-0.5">
								<span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full {getLocationColor(suggestion.location)}">
									{suggestion.location}
								</span>
								<span class="inline-block px-2 py-0.5 text-xs font-medium rounded-full {getIntensityColor(suggestion.intensity)}">
									{suggestion.intensity}
								</span>
							</div>
						</div>
					</div>
				{/each}
			</div>
		{:else}
			<div class="text-center py-8">
				<div class="text-gray-400 text-4xl mb-3">🏃‍♀️</div>
				<p class="text-gray-600 dark:text-gray-400">
					No weather data available for exercise suggestions
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