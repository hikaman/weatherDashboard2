<script lang="ts">
  import { weatherData } from '../stores/weather';
  
  interface Activity {
    name: string;
    icon: string;
    description: string;
    category: 'outdoor' | 'indoor' | 'mixed';
    suitability: 'perfect' | 'good' | 'okay';
  }
  
  $: suggestions = generateActivitySuggestions($weatherData);
  
  function generateActivitySuggestions(weather: any): Activity[] {
    if (!weather) return [];
    
    const activities: Activity[] = [];
    const temp = weather.current.temperature;
    const precipitation = weather.current.precipitation;
    const windSpeed = weather.current.windSpeed;
    const weatherCode = weather.current.weatherCode;
    
    // Clear weather activities
    if (precipitation === 0 && weatherCode <= 3) {
      if (temp >= 15 && temp <= 30) {
        activities.push({
          name: 'Hiking',
          icon: '🥾',
          description: 'Perfect weather for outdoor exploration',
          category: 'outdoor',
          suitability: 'perfect'
        });
        activities.push({
          name: 'Picnic',
          icon: '🧺',
          description: 'Great day for outdoor dining',
          category: 'outdoor',
          suitability: 'perfect'
        });
        activities.push({
          name: 'Cycling',
          icon: '🚴',
          description: 'Ideal conditions for bike rides',
          category: 'outdoor',
          suitability: 'perfect'
        });
      }
      
      if (temp >= 20) {
        activities.push({
          name: 'Beach Visit',
          icon: '🏖️',
          description: 'Perfect beach weather',
          category: 'outdoor',
          suitability: 'perfect'
        });
        activities.push({
          name: 'Outdoor Sports',
          icon: '⚽',
          description: 'Great for football, tennis, or frisbee',
          category: 'outdoor',
          suitability: 'perfect'
        });
        activities.push({
          name: 'Gardening',
          icon: '🌱',
          description: 'Perfect for tending to plants',
          category: 'outdoor',
          suitability: 'good'
        });
      }
      
      if (temp >= 10) {
        activities.push({
          name: 'Photography Walk',
          icon: '📸',
          description: 'Clear skies for great photos',
          category: 'outdoor',
          suitability: 'good'
        });
        activities.push({
          name: 'Outdoor Market',
          icon: '🛒',
          description: 'Nice weather for browsing markets',
          category: 'outdoor',
          suitability: 'good'
        });
      }
    }
    
    // Rainy weather activities
    if (precipitation > 0) {
      activities.push({
        name: 'Museum Visit',
        icon: '🏛️',
        description: 'Perfect indoor cultural activity',
        category: 'indoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Board Games',
        icon: '🎲',
        description: 'Cozy indoor entertainment',
        category: 'indoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Reading',
        icon: '📚',
        description: 'Perfect weather for a good book',
        category: 'indoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Movie Marathon',
        icon: '🎬',
        description: 'Great day for watching films',
        category: 'indoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Cooking',
        icon: '👨‍🍳',
        description: 'Try new recipes indoors',
        category: 'indoor',
        suitability: 'good'
      });
      activities.push({
        name: 'Art & Crafts',
        icon: '🎨',
        description: 'Creative indoor activities',
        category: 'indoor',
        suitability: 'good'
      });
    }
    
    // Cold weather activities
    if (temp <= 5) {
      activities.push({
        name: 'Hot Chocolate Café',
        icon: '☕',
        description: 'Warm up with a hot drink',
        category: 'indoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Indoor Shopping',
        icon: '🛍️',
        description: 'Stay warm while shopping',
        category: 'indoor',
        suitability: 'good'
      });
      
      if (precipitation === 0) {
        activities.push({
          name: 'Winter Walk',
          icon: '🚶',
          description: 'Brisk walk in cold air',
          category: 'outdoor',
          suitability: 'okay'
        });
      }
    }
    
    // Hot weather activities
    if (temp > 30) {
      activities.push({
        name: 'Swimming',
        icon: '🏊',
        description: 'Cool off in the water',
        category: 'outdoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Ice Cream Shop',
        icon: '🍦',
        description: 'Perfect weather for cold treats',
        category: 'mixed',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Air-conditioned Mall',
        icon: '🏬',
        description: 'Stay cool indoors',
        category: 'indoor',
        suitability: 'good'
      });
    }
    
    // Windy weather considerations
    if (windSpeed > 25) {
      activities.push({
        name: 'Kite Flying',
        icon: '🪁',
        description: 'Perfect wind conditions',
        category: 'outdoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Indoor Activities',
        icon: '🏠',
        description: 'Avoid strong winds outside',
        category: 'indoor',
        suitability: 'good'
      });
    }
    
    // Mild weather activities
    if (temp >= 15 && temp <= 25 && precipitation === 0) {
      activities.push({
        name: 'Outdoor Dining',
        icon: '🍽️',
        description: 'Perfect for patio dining',
        category: 'outdoor',
        suitability: 'perfect'
      });
      activities.push({
        name: 'Walking Tour',
        icon: '🚶‍♂️',
        description: 'Comfortable for exploring',
        category: 'outdoor',
        suitability: 'good'
      });
    }
    
    // Always available activities
    activities.push({
      name: 'Gym Workout',
      icon: '💪',
      description: 'Indoor fitness regardless of weather',
      category: 'indoor',
      suitability: 'good'
    });
    activities.push({
      name: 'Video Games',
      icon: '🎮',
      description: 'Entertainment for any weather',
      category: 'indoor',
      suitability: 'okay'
    });
    
    // Remove duplicates and sort by suitability
    const uniqueActivities = activities.filter((activity, index, self) => 
      index === self.findIndex(a => a.name === activity.name)
    );
    
    return uniqueActivities.sort((a, b) => {
      const suitabilityOrder = { perfect: 3, good: 2, okay: 1 };
      return suitabilityOrder[b.suitability] - suitabilityOrder[a.suitability];
    });
  }
  
  function getSuitabilityColor(suitability: string): string {
    switch (suitability) {
      case 'perfect': return 'text-green-600 dark:text-green-400';
      case 'good': return 'text-blue-600 dark:text-blue-400';
      case 'okay': return 'text-yellow-600 dark:text-yellow-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }
  
  function getSuitabilityBadge(suitability: string): string {
    switch (suitability) {
      case 'perfect': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'okay': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
  
  function getCategoryIcon(category: string): string {
    switch (category) {
      case 'outdoor': return '🌳';
      case 'indoor': return '🏠';
      case 'mixed': return '🔄';
      default: return '📍';
    }
  }
</script>

<div class="suggestion-card">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-2">🎯</span>
      Activity Suggestions
    </h3>
    {#if suggestions.length > 0}
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {suggestions.length} activities
      </span>
    {/if}
  </div>
  
  {#if suggestions.length === 0}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-2">🎪</div>
      <p class="text-gray-600 dark:text-gray-400">
        No activity suggestions available
      </p>
    </div>
  {:else}
    <div class="space-y-3">
      {#each suggestions as activity}
        <div class="flex items-center justify-between p-4 bg-white dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <span class="text-2xl">{activity.icon}</span>
              <span class="text-sm {getSuitabilityColor(activity.suitability)}">
                {getCategoryIcon(activity.category)}
              </span>
            </div>
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 dark:text-white">
                {activity.name}
              </h4>
              <p class="text-sm text-gray-600 dark:text-gray-400">
                {activity.description}
              </p>
            </div>
          </div>
          <div class="flex items-center space-x-2">
            <span class="px-2 py-1 text-xs font-medium rounded-full {getSuitabilityBadge(activity.suitability)}">
              {activity.suitability}
            </span>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Legend -->
    <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      <div class="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400">
        <div class="flex items-center space-x-4">
          <span>🌳 Outdoor</span>
          <span>🏠 Indoor</span>
          <span>🔄 Mixed</span>
        </div>
        <div class="flex items-center space-x-2">
          <span class="px-2 py-1 bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 rounded-full">Perfect</span>
          <span class="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 rounded-full">Good</span>
          <span class="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200 rounded-full">Okay</span>
        </div>
      </div>
    </div>
  {/if}
</div> 