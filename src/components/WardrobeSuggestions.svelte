<script lang="ts">
  import { weatherData } from '../stores/weather';
  
  interface WardrobeItem {
    item: string;
    icon: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
    category: 'temperature' | 'precipitation' | 'wind' | 'uv' | 'air_quality';
  }
  
  interface WardrobeSuggestions {
    adult: WardrobeItem[];
    child: WardrobeItem[];
  }
  
  $: suggestions = generateWardrobeSuggestions($weatherData);
  
  function generateWardrobeSuggestions(weather: any): WardrobeSuggestions {
    if (!weather) return { adult: [], child: [] };
    
    const adultSuggestions: WardrobeItem[] = [];
    const childSuggestions: WardrobeItem[] = [];
    
    const temp = weather.current.temperature;
    const apparentTemp = weather.current.apparentTemperature;
    const precipitation = weather.current.precipitation;
    const precipitationProb = weather.current.precipitationProbability;
    const windSpeed = weather.current.windSpeed;
    const uvIndex = weather.current.uvIndex;
    const humidity = weather.current.humidity;
    const pm25 = weather.hourly?.[0]?.pm25;
    
    // Temperature-based suggestions (using apparent temperature for better accuracy)
    if (apparentTemp <= 0) {
      adultSuggestions.push({
        item: 'Heavy Winter Coat',
        icon: '🧥',
        reason: `Feels like ${apparentTemp}°C - freezing conditions`,
        priority: 'high',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Thermal Layers',
        icon: '🧥',
        reason: 'Base layer for warmth',
        priority: 'high',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Warm Gloves',
        icon: '🧤',
        reason: 'Protect hands from frostbite',
        priority: 'high',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Winter Hat',
        icon: '🎩',
        reason: 'Prevent heat loss from head',
        priority: 'medium',
        category: 'temperature'
      });
      
      // Children need extra protection
      childSuggestions.push({
        item: 'Heavy Winter Coat + Extra Layer',
        icon: '🧥',
        reason: `Feels like ${apparentTemp}°C - children get cold faster`,
        priority: 'high',
        category: 'temperature'
      });
      childSuggestions.push({
        item: 'Warm Mittens',
        icon: '🧤',
        reason: 'Mittens keep fingers warmer than gloves',
        priority: 'high',
        category: 'temperature'
      });
      childSuggestions.push({
        item: 'Winter Hat + Scarf',
        icon: '🧣',
        reason: 'Cover neck and head completely',
        priority: 'high',
        category: 'temperature'
      });
      childSuggestions.push({
        item: 'Warm Boots',
        icon: '🥾',
        reason: 'Insulated footwear essential',
        priority: 'high',
        category: 'temperature'
      });
    } else if (apparentTemp <= 5) {
      adultSuggestions.push({
        item: 'Warm Jacket',
        icon: '🧥',
        reason: `Feels like ${apparentTemp}°C - very cold`,
        priority: 'high',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Long Pants',
        icon: '👖',
        reason: 'Keep legs warm',
        priority: 'medium',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Closed Shoes',
        icon: '👞',
        reason: 'Foot protection from cold',
        priority: 'medium',
        category: 'temperature'
      });
      
      childSuggestions.push({
        item: 'Warm Jacket + Sweater',
        icon: '🧥',
        reason: `Feels like ${apparentTemp}°C - layer up for kids`,
        priority: 'high',
        category: 'temperature'
      });
      childSuggestions.push({
        item: 'Warm Hat',
        icon: '🎩',
        reason: 'Children lose heat quickly through head',
        priority: 'medium',
        category: 'temperature'
      });
    } else if (apparentTemp <= 15) {
      adultSuggestions.push({
        item: 'Light Jacket',
        icon: '🧥',
        reason: `Feels like ${apparentTemp}°C - cool weather`,
        priority: 'medium',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Long-sleeve Shirt',
        icon: '👕',
        reason: 'Comfortable for mild weather',
        priority: 'low',
        category: 'temperature'
      });
      
      childSuggestions.push({
        item: 'Jacket + Long Sleeves',
        icon: '🧥',
        reason: `Feels like ${apparentTemp}°C - kids need extra warmth`,
        priority: 'medium',
        category: 'temperature'
      });
    } else if (apparentTemp <= 25) {
      adultSuggestions.push({
        item: 'Light Sweater or T-Shirt',
        icon: '👕',
        reason: `Feels like ${apparentTemp}°C - pleasant weather`,
        priority: 'medium',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Comfortable Pants',
        icon: '👖',
        reason: 'Suitable for mild temperatures',
        priority: 'low',
        category: 'temperature'
      });
      
      childSuggestions.push({
        item: 'T-Shirt + Light Layer',
        icon: '👕',
        reason: `Feels like ${apparentTemp}°C - comfortable for play`,
        priority: 'medium',
        category: 'temperature'
      });
    } else if (apparentTemp <= 30) {
      adultSuggestions.push({
        item: 'T-Shirt',
        icon: '👕',
        reason: `Feels like ${apparentTemp}°C - warm weather`,
        priority: 'medium',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Shorts',
        icon: '🩳',
        reason: 'Stay cool and comfortable',
        priority: 'medium',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Breathable Footwear',
        icon: '👟',
        reason: 'Allow feet to breathe',
        priority: 'low',
        category: 'temperature'
      });
      
      childSuggestions.push({
        item: 'Light T-Shirt',
        icon: '👕',
        reason: `Feels like ${apparentTemp}°C - keep kids cool`,
        priority: 'medium',
        category: 'temperature'
      });
      childSuggestions.push({
        item: 'Shorts',
        icon: '🩳',
        reason: 'Comfortable for active play',
        priority: 'medium',
        category: 'temperature'
      });
    } else {
      adultSuggestions.push({
        item: 'Lightweight Clothing',
        icon: '👕',
        reason: `Feels like ${apparentTemp}°C - very hot`,
        priority: 'high',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Shorts',
        icon: '🩳',
        reason: 'Essential for heat management',
        priority: 'high',
        category: 'temperature'
      });
      adultSuggestions.push({
        item: 'Sandals',
        icon: '👡',
        reason: 'Maximum breathability',
        priority: 'medium',
        category: 'temperature'
      });
      
      childSuggestions.push({
        item: 'Lightweight Clothing',
        icon: '👕',
        reason: `Feels like ${apparentTemp}°C - prevent overheating`,
        priority: 'high',
        category: 'temperature'
      });
      childSuggestions.push({
        item: 'Sun Hat',
        icon: '👒',
        reason: 'Essential sun protection for kids',
        priority: 'high',
        category: 'uv'
      });
    }
    
    // Precipitation-based suggestions
    if (precipitation > 0 || precipitationProb > 50) {
      const rainIntensity = precipitation > 5 ? 'heavy' : precipitation > 1 ? 'moderate' : 'light';
      
      adultSuggestions.push({
        item: 'Umbrella',
        icon: '☂️',
        reason: `${precipitationProb}% chance of ${rainIntensity} rain`,
        priority: 'high',
        category: 'precipitation'
      });
      adultSuggestions.push({
        item: 'Waterproof Jacket',
        icon: '🧥',
        reason: 'Stay dry in the rain',
        priority: 'high',
        category: 'precipitation'
      });
      adultSuggestions.push({
        item: 'Waterproof Shoes',
        icon: '🥾',
        reason: 'Keep feet dry',
        priority: 'medium',
        category: 'precipitation'
      });
      
      childSuggestions.push({
        item: 'Raincoat',
        icon: '🧥',
        reason: `${precipitationProb}% chance of rain - kids love puddles!`,
        priority: 'high',
        category: 'precipitation'
      });
      childSuggestions.push({
        item: 'Rain Boots',
        icon: '🥾',
        reason: 'Perfect for puddle jumping',
        priority: 'high',
        category: 'precipitation'
      });
      childSuggestions.push({
        item: 'Rain Hat',
        icon: '🎩',
        reason: 'Keep head dry during play',
        priority: 'medium',
        category: 'precipitation'
      });
    }
    
    // Wind-based suggestions
    if (windSpeed > 20) {
      const windStrength = windSpeed > 40 ? 'very strong' : windSpeed > 30 ? 'strong' : 'moderate';
      
      adultSuggestions.push({
        item: 'Windbreaker',
        icon: '🧥',
        reason: `${windSpeed}km/h ${windStrength} winds`,
        priority: 'medium',
        category: 'wind'
      });
      adultSuggestions.push({
        item: 'Secure Hat',
        icon: '🧢',
        reason: 'Won\'t blow away in wind',
        priority: 'low',
        category: 'wind'
      });
      
      childSuggestions.push({
        item: 'Windproof Jacket',
        icon: '🧥',
        reason: `${windSpeed}km/h winds - kids feel wind chill more`,
        priority: 'medium',
        category: 'wind'
      });
      childSuggestions.push({
        item: 'Secure Hat with Chin Strap',
        icon: '🧢',
        reason: 'Stay on during windy play',
        priority: 'medium',
        category: 'wind'
      });
    }
    
    // UV Index-based suggestions
    if (uvIndex >= 3) {
      const uvLevel = uvIndex >= 8 ? 'very high' : uvIndex >= 6 ? 'high' : uvIndex >= 3 ? 'moderate' : 'low';
      
      adultSuggestions.push({
        item: 'Sunglasses',
        icon: '🕶️',
        reason: `UV Index ${uvIndex} (${uvLevel}) - eye protection needed`,
        priority: uvIndex >= 6 ? 'high' : 'medium',
        category: 'uv'
      });
      adultSuggestions.push({
        item: 'Sunscreen SPF 30+',
        icon: '🧴',
        reason: `UV Index ${uvIndex} - skin protection essential`,
        priority: uvIndex >= 6 ? 'high' : 'medium',
        category: 'uv'
      });
      
      if (uvIndex >= 6) {
        adultSuggestions.push({
          item: 'Wide-brimmed Hat',
          icon: '👒',
          reason: `UV Index ${uvIndex} - face and neck protection`,
          priority: 'high',
          category: 'uv'
        });
      }
      
      childSuggestions.push({
        item: 'Sunscreen SPF 50+',
        icon: '🧴',
        reason: `UV Index ${uvIndex} - children's skin is more sensitive`,
        priority: 'high',
        category: 'uv'
      });
      childSuggestions.push({
        item: 'Wide-brimmed Hat',
        icon: '👒',
        reason: `UV Index ${uvIndex} - essential for kids`,
        priority: 'high',
        category: 'uv'
      });
      
      if (uvIndex >= 6) {
        childSuggestions.push({
          item: 'UV-protective Clothing',
          icon: '👕',
          reason: `UV Index ${uvIndex} - long sleeves recommended`,
          priority: 'high',
          category: 'uv'
        });
      }
    }
    
    // Air Quality-based suggestions
    if (pm25 && pm25 > 25) {
      const aqLevel = pm25 > 75 ? 'very unhealthy' : pm25 > 55 ? 'unhealthy' : pm25 > 35 ? 'unhealthy for sensitive groups' : 'moderate';
      
      adultSuggestions.push({
        item: 'Face Mask (N95)',
        icon: '😷',
        reason: `PM2.5: ${pm25}μg/m³ (${aqLevel})`,
        priority: pm25 > 55 ? 'high' : 'medium',
        category: 'air_quality'
      });
      
      childSuggestions.push({
        item: 'Child-sized Face Mask',
        icon: '😷',
        reason: `PM2.5: ${pm25}μg/m³ - children more vulnerable to air pollution`,
        priority: 'high',
        category: 'air_quality'
      });
    }
    
    // Humidity-based suggestions
    if (humidity > 80) {
      adultSuggestions.push({
        item: 'Breathable Fabrics',
        icon: '👕',
        reason: `${humidity}% humidity - avoid synthetic materials`,
        priority: 'medium',
        category: 'temperature'
      });
      
      childSuggestions.push({
        item: 'Moisture-wicking Clothes',
        icon: '👕',
        reason: `${humidity}% humidity - keep kids dry during play`,
        priority: 'medium',
        category: 'temperature'
      });
    }
    
    // Remove duplicates and sort by priority
    const uniqueAdult = removeDuplicates(adultSuggestions);
    const uniqueChild = removeDuplicates(childSuggestions);
    
    return {
      adult: uniqueAdult.sort(sortByPriority),
      child: uniqueChild.sort(sortByPriority)
    };
  }
  
  function removeDuplicates(suggestions: WardrobeItem[]): WardrobeItem[] {
    return suggestions.filter((item, index, self) => 
      index === self.findIndex(t => t.item === item.item)
    );
  }
  
  function sortByPriority(a: WardrobeItem, b: WardrobeItem): number {
    const priorityOrder = { high: 3, medium: 2, low: 1 };
    return priorityOrder[b.priority] - priorityOrder[a.priority];
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
  
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'temperature': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'precipitation': return 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900/50 dark:text-cyan-200';
      case 'wind': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
      case 'uv': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200';
      case 'air_quality': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
  
  let selectedTab: 'adult' | 'child' = 'adult';
</script>

<div class="suggestion-card">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-2">👗</span>
      Wardrobe Suggestions
    </h3>
    {#if suggestions.adult.length > 0 || suggestions.child.length > 0}
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Smart recommendations
      </span>
    {/if}
  </div>
  
  <!-- Tab Navigation -->
  <div class="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
    <button
      class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 {selectedTab === 'adult' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
      on:click={() => selectedTab = 'adult'}
    >
      👨‍💼 Adults ({suggestions.adult.length})
    </button>
    <button
      class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 {selectedTab === 'child' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
      on:click={() => selectedTab = 'child'}
    >
      👶 Children ({suggestions.child.length})
    </button>
  </div>
  
  {#if (selectedTab === 'adult' && suggestions.adult.length === 0) || (selectedTab === 'child' && suggestions.child.length === 0)}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-2">👔</div>
      <p class="text-gray-600 dark:text-gray-400">
        No wardrobe suggestions available for {selectedTab}s
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {#each selectedTab === 'adult' ? suggestions.adult : suggestions.child as suggestion}
        <div class="border rounded-lg p-4 transition-all duration-200 hover:shadow-md {getPriorityColor(suggestion.priority)}">
          <div class="flex items-start justify-between mb-2">
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
          <div class="flex justify-end">
            <span class="px-2 py-1 text-xs font-medium rounded-full {getCategoryColor(suggestion.category)}">
              {suggestion.category.replace('_', ' ')}
            </span>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Enhanced Weather Summary -->
    {#if $weatherData}
      <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium">Based on:</span>
          {$weatherData.current.temperature}°C (feels like {$weatherData.current.apparentTemperature}°C), 
          {#if $weatherData.current.precipitation > 0}
            {$weatherData.current.precipitation}mm rain,
          {:else if $weatherData.current.precipitationProbability > 0}
            {$weatherData.current.precipitationProbability}% rain chance,
          {:else}
            no rain,
          {/if}
          {$weatherData.current.windSpeed}km/h wind,
          UV Index {$weatherData.current.uvIndex}
          {#if $weatherData.hourly?.[0]?.pm25}
            , PM2.5: {$weatherData.hourly[0].pm25}μg/m³
          {/if}
        </p>
      </div>
    {/if}
  {/if}
</div> 