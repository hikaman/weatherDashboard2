<script lang="ts">
  import { weatherData } from '../stores/weather';
  import { onMount } from 'svelte';
  import { t } from '../lib/i18n';
  
  // Mock transition data for now - will integrate with weather state mapper later
  interface TimelineItem {
    time: string;
    weatherState: string;
    emoji: string;
    probability: number;
    recommendations: {
      wardrobe: { item: string; link?: string; };
      fitness: { activity: string; link?: string; };
      meal: { suggestion: string; link?: string; };
      activity: { event: string; link?: string; };
    };
    forecast: string;
  }

  let timelineItems: TimelineItem[] = [];
  let selectedScenario = 0;

  // Generate mock timeline data based on weather
  $: if ($weatherData) {
    generateTimelineItems($weatherData);
  }

  function generateTimelineItems(weather: any) {
    if (!weather) return;

    const items: TimelineItem[] = [];
    const currentTemp = weather.current.temperature;
    const precipitation = weather.current.precipitationProbability;

    // Generate items for next 24 hours (every 6 hours)
    for (let i = 0; i < 4; i++) {
      const hour = new Date();
      hour.setHours(hour.getHours() + (i * 6));
      
      let weatherState = 'Sunny';
      let emoji = '☀️';
      let probability = 0.7;
      
      // Simple weather state logic (will be replaced with proper mapper)
      if (precipitation > 60) {
        weatherState = 'Showery';
        emoji = '🌦️';
        probability = precipitation / 100;
      } else if (currentTemp > 30) {
        weatherState = 'Hot_Sunny';
        emoji = '🔥';
        probability = 0.8;
      } else if (currentTemp < 10) {
        weatherState = 'Cold';
        emoji = '🥶';
        probability = 0.9;
      }

      items.push({
        time: hour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        weatherState,
        emoji,
        probability,
        recommendations: {
          wardrobe: {
            item: weatherState === 'Showery' ? 'Light rain jacket' : 
                  weatherState === 'Hot_Sunny' ? 'Breathable t-shirt' :
                  weatherState === 'Cold' ? 'Warm coat' : 'Comfortable layers',
            link: 'https://amazon.com/search?k=rain+jacket'
          },
          fitness: {
            activity: weatherState === 'Showery' ? 'Indoor yoga' :
                     weatherState === 'Hot_Sunny' ? 'Early morning run' :
                     weatherState === 'Cold' ? 'Gym workout' : 'Outdoor cycling',
            link: 'https://nike.com/fitness'
          },
          meal: {
            suggestion: weatherState === 'Showery' ? 'Warm soup' :
                       weatherState === 'Hot_Sunny' ? 'Cold gazpacho' :
                       weatherState === 'Cold' ? 'Hot stew' : 'Fresh salad',
            link: 'https://instacart.com'
          },
          activity: {
            event: weatherState === 'Showery' ? 'Indoor art gallery' :
                   weatherState === 'Hot_Sunny' ? 'Beach visit' :
                   weatherState === 'Cold' ? 'Museum tour' : 'Outdoor market',
            link: 'https://eventbrite.com'
          }
        },
        forecast: weatherState === 'Showery' ? 'Light showers expected' :
                 weatherState === 'Hot_Sunny' ? 'Sunny and hot conditions' :
                 weatherState === 'Cold' ? 'Cool temperatures ahead' : 'Pleasant weather continues'
      });
    }

    timelineItems = items;
  }

  function formatProbability(prob: number): string {
    return `${Math.round(prob * 100)}%`;
  }

  function getStateColor(state: string): string {
    const colors: Record<string, string> = {
      'Sunny': 'bg-yellow-100 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700',
      'Hot_Sunny': 'bg-orange-100 border-orange-300 dark:bg-orange-900/20 dark:border-orange-700',
      'Showery': 'bg-blue-100 border-blue-300 dark:bg-blue-900/20 dark:border-blue-700',
      'Cold': 'bg-gray-100 border-gray-300 dark:bg-gray-900/20 dark:border-gray-700',
      'Rainy': 'bg-indigo-100 border-indigo-300 dark:bg-indigo-900/20 dark:border-indigo-700'
    };
    return colors[state] || 'bg-gray-100 border-gray-300 dark:bg-gray-900/20 dark:border-gray-700';
  }

  function getProbabilityColor(prob: number): string {
    if (prob >= 0.7) return 'text-green-600 dark:text-green-400';
    if (prob >= 0.4) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  }
</script>

<div class="weather-card">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-3">⏰</span>
      Decision Timeline
    </h2>
    <div class="text-sm text-gray-500 dark:text-gray-400">
      Next 24 hours
    </div>
  </div>

  {#if timelineItems.length === 0}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-3">🌤️</div>
      <p class="text-gray-600 dark:text-gray-400">{$t.loadingTimeline}</p>
    </div>
  {:else}
    <!-- Timeline Container -->
    <div class="space-y-6">
      {#each timelineItems as item, index}
        <div class="timeline-item relative">
          <!-- Timeline connector -->
          {#if index < timelineItems.length - 1}
            <div class="absolute left-6 top-16 w-0.5 h-16 bg-gray-200 dark:bg-gray-700"></div>
          {/if}
          
          <!-- Timeline content -->
          <div class="flex items-start space-x-4">
            <!-- Time indicator -->
            <div class="flex-shrink-0 w-12 h-12 rounded-full {getStateColor(item.weatherState)} border-2 flex items-center justify-center">
              <span class="text-xl">{item.emoji}</span>
            </div>
            
            <!-- Content -->
            <div class="flex-1 min-w-0">
              <!-- Header -->
              <div class="flex items-center justify-between mb-3">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {item.time}
                  </h3>
                  <p class="text-sm text-gray-600 dark:text-gray-400">
                    {item.weatherState} • <span class="{getProbabilityColor(item.probability)}">{formatProbability(item.probability)}</span>
                  </p>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                  {item.forecast}
                </div>
              </div>
              
              <!-- Recommendations Grid -->
              <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                <!-- Wardrobe -->
                <div class="recommendation-card bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-purple-700 dark:text-purple-300">👗 Wardrobe</span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.recommendations.wardrobe.item}</p>
                  <button 
                    on:click={() => window.open(item.recommendations.wardrobe.link, '_blank')}
                    class="w-full text-xs bg-purple-600 text-white px-2 py-1 rounded hover:bg-purple-700 transition-colors"
                  >
                    Shop Now
                  </button>
                </div>
                
                <!-- Fitness -->
                <div class="recommendation-card bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-green-700 dark:text-green-300">💪 Fitness</span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.recommendations.fitness.activity}</p>
                  <button 
                    on:click={() => window.open(item.recommendations.fitness.link, '_blank')}
                    class="w-full text-xs bg-green-600 text-white px-2 py-1 rounded hover:bg-green-700 transition-colors"
                  >
                    Shop Gear
                  </button>
                </div>
                
                <!-- Meal -->
                <div class="recommendation-card bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-orange-700 dark:text-orange-300">🍽️ Meal</span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.recommendations.meal.suggestion}</p>
                  <button 
                    on:click={() => window.open(item.recommendations.meal.link, '_blank')}
                    class="w-full text-xs bg-orange-600 text-white px-2 py-1 rounded hover:bg-orange-700 transition-colors"
                  >
                    Order Now
                  </button>
                </div>
                
                <!-- Activity -->
                <div class="recommendation-card bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                  <div class="flex items-center justify-between mb-2">
                    <span class="text-sm font-medium text-blue-700 dark:text-blue-300">🎯 Activity</span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300 mb-2">{item.recommendations.activity.event}</p>
                  <button 
                    on:click={() => window.open(item.recommendations.activity.link, '_blank')}
                    class="w-full text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition-colors"
                  >
                    Buy Tickets
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Scenario Toggle -->
    <div class="mt-8 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
        🎭 Alternative Scenarios
      </h4>
      <div class="flex space-x-2">
        <button 
          class="px-3 py-1 text-xs rounded {selectedScenario === 0 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}"
          on:click={() => selectedScenario = 0}
        >
          Most Likely
        </button>
        <button 
          class="px-3 py-1 text-xs rounded {selectedScenario === 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}"
          on:click={() => selectedScenario = 1}
        >
          If Rainy
        </button>
        <button 
          class="px-3 py-1 text-xs rounded {selectedScenario === 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}"
          on:click={() => selectedScenario = 2}
        >
          If Sunny
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .recommendation-card {
    @apply p-3 rounded-lg transition-all duration-200 hover:shadow-md;
  }
  
  .timeline-item {
    @apply relative;
  }
  
  .timeline-item:hover .recommendation-card {
    @apply transform scale-105;
  }
</style> 