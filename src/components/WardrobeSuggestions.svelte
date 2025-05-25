<script lang="ts">
  import { weatherData } from '../stores/weather';
  
  interface WardrobeItem {
    item: string;
    icon: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }
  
  $: suggestions = generateWardrobeSuggestions($weatherData);
  
  function generateWardrobeSuggestions(weather: any): WardrobeItem[] {
    if (!weather) return [];
    
    const suggestions: WardrobeItem[] = [];
    const temp = weather.current.temperature;
    const precipitation = weather.current.precipitation;
    const windSpeed = weather.current.windSpeed;
    const humidity = weather.current.humidity;
    
    // Temperature-based suggestions
    if (temp <= 0) {
      suggestions.push({
        item: 'Heavy Winter Coat',
        icon: '🧥',
        reason: 'Freezing temperatures',
        priority: 'high'
      });
      suggestions.push({
        item: 'Warm Gloves',
        icon: '🧤',
        reason: 'Protect hands from cold',
        priority: 'high'
      });
      suggestions.push({
        item: 'Winter Hat',
        icon: '🎩',
        reason: 'Keep head warm',
        priority: 'medium'
      });
    } else if (temp <= 10) {
      suggestions.push({
        item: 'Warm Jacket',
        icon: '🧥',
        reason: 'Cold weather',
        priority: 'high'
      });
      suggestions.push({
        item: 'Long Pants',
        icon: '👖',
        reason: 'Keep legs warm',
        priority: 'medium'
      });
      suggestions.push({
        item: 'Closed Shoes',
        icon: '👞',
        reason: 'Foot protection',
        priority: 'medium'
      });
    } else if (temp <= 20) {
      suggestions.push({
        item: 'Light Sweater',
        icon: '👕',
        reason: 'Mild temperature',
        priority: 'medium'
      });
      suggestions.push({
        item: 'Jeans',
        icon: '👖',
        reason: 'Comfortable for mild weather',
        priority: 'low'
      });
    } else if (temp <= 30) {
      suggestions.push({
        item: 'T-Shirt',
        icon: '👕',
        reason: 'Warm weather',
        priority: 'medium'
      });
      suggestions.push({
        item: 'Shorts',
        icon: '🩳',
        reason: 'Stay cool',
        priority: 'medium'
      });
      suggestions.push({
        item: 'Sneakers',
        icon: '👟',
        reason: 'Comfortable footwear',
        priority: 'low'
      });
    } else {
      suggestions.push({
        item: 'Light Clothing',
        icon: '👕',
        reason: 'Very hot weather',
        priority: 'high'
      });
      suggestions.push({
        item: 'Shorts',
        icon: '🩳',
        reason: 'Stay cool',
        priority: 'high'
      });
      suggestions.push({
        item: 'Sandals',
        icon: '👡',
        reason: 'Breathable footwear',
        priority: 'medium'
      });
      suggestions.push({
        item: 'Sun Hat',
        icon: '👒',
        reason: 'Sun protection',
        priority: 'medium'
      });
    }
    
    // Precipitation-based suggestions
    if (precipitation > 0) {
      suggestions.push({
        item: 'Umbrella',
        icon: '☂️',
        reason: 'Rain protection',
        priority: 'high'
      });
      suggestions.push({
        item: 'Waterproof Jacket',
        icon: '🧥',
        reason: 'Stay dry',
        priority: 'high'
      });
      suggestions.push({
        item: 'Waterproof Shoes',
        icon: '🥾',
        reason: 'Keep feet dry',
        priority: 'medium'
      });
    }
    
    // Wind-based suggestions
    if (windSpeed > 20) {
      suggestions.push({
        item: 'Windbreaker',
        icon: '🧥',
        reason: 'Wind protection',
        priority: 'medium'
      });
      suggestions.push({
        item: 'Secure Hat',
        icon: '🧢',
        reason: 'Won\'t blow away',
        priority: 'low'
      });
    }
    
    // Humidity-based suggestions
    if (humidity > 80) {
      suggestions.push({
        item: 'Breathable Fabrics',
        icon: '👕',
        reason: 'High humidity',
        priority: 'medium'
      });
    }
    
    // Sun protection for clear days
    if (precipitation === 0 && temp > 20) {
      suggestions.push({
        item: 'Sunglasses',
        icon: '🕶️',
        reason: 'UV protection',
        priority: 'medium'
      });
      suggestions.push({
        item: 'Sunscreen',
        icon: '🧴',
        reason: 'Skin protection',
        priority: 'medium'
      });
    }
    
    // Remove duplicates and sort by priority
    const uniqueSuggestions = suggestions.filter((item, index, self) => 
      index === self.findIndex(t => t.item === item.item)
    );
    
    return uniqueSuggestions.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  function getPriorityColor(priority: string): string {
    switch (priority) {
      case 'high': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      case 'medium': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'low': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20';
    }
  }
  
  function getPriorityBadge(priority: string): string {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
</script>

<div class="suggestion-card">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-2">👗</span>
      Wardrobe Suggestions
    </h3>
    {#if suggestions.length > 0}
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {suggestions.length} items
      </span>
    {/if}
  </div>
  
  {#if suggestions.length === 0}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-2">👔</div>
      <p class="text-gray-600 dark:text-gray-400">
        No wardrobe suggestions available
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {#each suggestions as suggestion}
        <div class="border rounded-lg p-4 transition-all duration-200 hover:shadow-md {getPriorityColor(suggestion.priority)}">
          <div class="flex items-start justify-between">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{suggestion.icon}</span>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {suggestion.item}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {suggestion.reason}
                </p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full {getPriorityBadge(suggestion.priority)}">
              {suggestion.priority}
            </span>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Weather Summary -->
    {#if $weatherData}
      <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium">Based on:</span>
          {$weatherData.current.temperature}°C, 
          {$weatherData.current.precipitation > 0 ? `${$weatherData.current.precipitation}mm rain` : 'no rain'}, 
          {$weatherData.current.windSpeed}km/h wind
        </p>
      </div>
    {/if}
  {/if}
</div> 