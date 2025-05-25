<script lang="ts">
  import { weatherData } from '../stores/weather';
  
  interface FoodSuggestion {
    name: string;
    icon: string;
    description: string;
    category: 'hot' | 'cold' | 'warm' | 'refreshing';
    mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack' | 'drink';
    appeal: 'high' | 'medium' | 'low';
  }
  
  $: suggestions = generateFoodSuggestions($weatherData);
  
  function generateFoodSuggestions(weather: any): FoodSuggestion[] {
    if (!weather) return [];
    
    const foods: FoodSuggestion[] = [];
    const temp = weather.current.temperature;
    const precipitation = weather.current.precipitation;
    const humidity = weather.current.humidity;
    
    // Cold weather foods (below 10°C)
    if (temp <= 10) {
      foods.push({
        name: 'Hot Soup',
        icon: '🍲',
        description: 'Warm and comforting on cold days',
        category: 'hot',
        mealType: 'lunch',
        appeal: 'high'
      });
      foods.push({
        name: 'Hot Chocolate',
        icon: '☕',
        description: 'Perfect warm drink for cold weather',
        category: 'hot',
        mealType: 'drink',
        appeal: 'high'
      });
      foods.push({
        name: 'Hearty Stew',
        icon: '🥘',
        description: 'Filling and warming meal',
        category: 'hot',
        mealType: 'dinner',
        appeal: 'high'
      });
      foods.push({
        name: 'Warm Oatmeal',
        icon: '🥣',
        description: 'Cozy breakfast to start the day',
        category: 'warm',
        mealType: 'breakfast',
        appeal: 'medium'
      });
      foods.push({
        name: 'Grilled Cheese',
        icon: '🥪',
        description: 'Comfort food for chilly weather',
        category: 'hot',
        mealType: 'lunch',
        appeal: 'medium'
      });
    }
    
    // Cool weather foods (10-20°C)
    if (temp > 10 && temp <= 20) {
      foods.push({
        name: 'Warm Tea',
        icon: '🍵',
        description: 'Soothing drink for mild weather',
        category: 'warm',
        mealType: 'drink',
        appeal: 'medium'
      });
      foods.push({
        name: 'Pasta',
        icon: '🍝',
        description: 'Comforting and satisfying',
        category: 'warm',
        mealType: 'dinner',
        appeal: 'medium'
      });
      foods.push({
        name: 'Toast & Jam',
        icon: '🍞',
        description: 'Simple and warming breakfast',
        category: 'warm',
        mealType: 'breakfast',
        appeal: 'medium'
      });
      foods.push({
        name: 'Warm Salad',
        icon: '🥗',
        description: 'Light but warming meal',
        category: 'warm',
        mealType: 'lunch',
        appeal: 'low'
      });
    }
    
    // Warm weather foods (20-30°C)
    if (temp > 20 && temp <= 30) {
      foods.push({
        name: 'Fresh Salad',
        icon: '🥗',
        description: 'Light and refreshing meal',
        category: 'cold',
        mealType: 'lunch',
        appeal: 'high'
      });
      foods.push({
        name: 'Iced Coffee',
        icon: '🧊',
        description: 'Cool caffeine boost',
        category: 'cold',
        mealType: 'drink',
        appeal: 'high'
      });
      foods.push({
        name: 'Fruit Bowl',
        icon: '🍓',
        description: 'Fresh and hydrating snack',
        category: 'refreshing',
        mealType: 'snack',
        appeal: 'medium'
      });
      foods.push({
        name: 'Sandwich',
        icon: '🥪',
        description: 'Light and easy meal',
        category: 'cold',
        mealType: 'lunch',
        appeal: 'medium'
      });
      foods.push({
        name: 'Yogurt',
        icon: '🥛',
        description: 'Cool and nutritious',
        category: 'cold',
        mealType: 'breakfast',
        appeal: 'medium'
      });
    }
    
    // Hot weather foods (above 30°C)
    if (temp > 30) {
      foods.push({
        name: 'Ice Cream',
        icon: '🍦',
        description: 'Perfect cooling treat',
        category: 'cold',
        mealType: 'snack',
        appeal: 'high'
      });
      foods.push({
        name: 'Smoothie',
        icon: '🥤',
        description: 'Refreshing and nutritious',
        category: 'refreshing',
        mealType: 'drink',
        appeal: 'high'
      });
      foods.push({
        name: 'Gazpacho',
        icon: '🍅',
        description: 'Cold soup for hot days',
        category: 'cold',
        mealType: 'lunch',
        appeal: 'high'
      });
      foods.push({
        name: 'Watermelon',
        icon: '🍉',
        description: 'Hydrating and cooling',
        category: 'refreshing',
        mealType: 'snack',
        appeal: 'high'
      });
      foods.push({
        name: 'Popsicle',
        icon: '🍭',
        description: 'Instant cooling relief',
        category: 'cold',
        mealType: 'snack',
        appeal: 'medium'
      });
      foods.push({
        name: 'Cold Brew',
        icon: '🧊',
        description: 'Refreshing caffeine fix',
        category: 'cold',
        mealType: 'drink',
        appeal: 'medium'
      });
    }
    
    // Rainy weather comfort foods
    if (precipitation > 0) {
      foods.push({
        name: 'Mac & Cheese',
        icon: '🧀',
        description: 'Ultimate comfort food',
        category: 'hot',
        mealType: 'dinner',
        appeal: 'high'
      });
      foods.push({
        name: 'Hot Tea',
        icon: '🍵',
        description: 'Cozy drink for rainy days',
        category: 'hot',
        mealType: 'drink',
        appeal: 'high'
      });
      foods.push({
        name: 'Cookies',
        icon: '🍪',
        description: 'Sweet comfort snack',
        category: 'warm',
        mealType: 'snack',
        appeal: 'medium'
      });
      foods.push({
        name: 'Pizza',
        icon: '🍕',
        description: 'Comforting and satisfying',
        category: 'hot',
        mealType: 'dinner',
        appeal: 'medium'
      });
    }
    
    // High humidity foods
    if (humidity > 70) {
      foods.push({
        name: 'Cucumber Water',
        icon: '🥒',
        description: 'Hydrating and cooling',
        category: 'refreshing',
        mealType: 'drink',
        appeal: 'medium'
      });
      foods.push({
        name: 'Light Snacks',
        icon: '🥨',
        description: 'Easy to digest in humidity',
        category: 'cold',
        mealType: 'snack',
        appeal: 'low'
      });
    }
    
    // Universal options
    foods.push({
      name: 'Water',
      icon: '💧',
      description: 'Always important to stay hydrated',
      category: 'refreshing',
      mealType: 'drink',
      appeal: 'medium'
    });
    
    // Remove duplicates and sort by appeal
    const uniqueFoods = foods.filter((food, index, self) => 
      index === self.findIndex(f => f.name === food.name)
    );
    
    return uniqueFoods.sort((a, b) => {
      const appealOrder = { high: 3, medium: 2, low: 1 };
      return appealOrder[b.appeal] - appealOrder[a.appeal];
    });
  }
  
  function getAppealColor(appeal: string): string {
    switch (appeal) {
      case 'high': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'medium': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'low': return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20';
    }
  }
  
  function getAppealBadge(appeal: string): string {
    switch (appeal) {
      case 'high': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'medium': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'low': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
  
  function getMealTypeIcon(mealType: string): string {
    switch (mealType) {
      case 'breakfast': return '🌅';
      case 'lunch': return '🌞';
      case 'dinner': return '🌙';
      case 'snack': return '🍎';
      case 'drink': return '🥤';
      default: return '🍽️';
    }
  }
  
  function getCategoryColor(category: string): string {
    switch (category) {
      case 'hot': return 'text-red-500';
      case 'warm': return 'text-orange-500';
      case 'cold': return 'text-blue-500';
      case 'refreshing': return 'text-cyan-500';
      default: return 'text-gray-500';
    }
  }
</script>

<div class="suggestion-card">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-2">🍽️</span>
      Food Suggestions
    </h3>
    {#if suggestions.length > 0}
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {suggestions.length} items
      </span>
    {/if}
  </div>
  
  {#if suggestions.length === 0}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-2">🍴</div>
      <p class="text-gray-600 dark:text-gray-400">
        No food suggestions available
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {#each suggestions as food}
        <div class="border rounded-lg p-4 transition-all duration-200 hover:shadow-md {getAppealColor(food.appeal)}">
          <div class="flex items-start justify-between mb-2">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{food.icon}</span>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {food.name}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {food.description}
                </p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full {getAppealBadge(food.appeal)}">
              {food.appeal}
            </span>
          </div>
          
          <div class="flex items-center justify-between text-xs">
            <div class="flex items-center space-x-2">
              <span class="flex items-center space-x-1">
                <span>{getMealTypeIcon(food.mealType)}</span>
                <span class="text-gray-600 dark:text-gray-400 capitalize">{food.mealType}</span>
              </span>
            </div>
            <span class="flex items-center space-x-1">
              <span class="{getCategoryColor(food.category)}">●</span>
              <span class="text-gray-600 dark:text-gray-400 capitalize">{food.category}</span>
            </span>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Legend -->
    <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      <div class="grid grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <div class="font-medium mb-1">Meal Types:</div>
          <div class="space-y-1">
            <div>🌅 Breakfast</div>
            <div>🌞 Lunch</div>
            <div>🌙 Dinner</div>
            <div>🍎 Snack</div>
            <div>🥤 Drink</div>
          </div>
        </div>
        <div>
          <div class="font-medium mb-1">Temperature:</div>
          <div class="space-y-1">
            <div><span class="text-red-500">●</span> Hot</div>
            <div><span class="text-orange-500">●</span> Warm</div>
            <div><span class="text-blue-500">●</span> Cold</div>
            <div><span class="text-cyan-500">●</span> Refreshing</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Weather Context -->
    {#if $weatherData}
      <div class="mt-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium">Perfect for:</span>
          {$weatherData.current.temperature}°C weather
          {#if $weatherData.current.precipitation > 0}
            with rain
          {/if}
          {#if $weatherData.current.humidity > 70}
            and high humidity
          {/if}
        </p>
      </div>
    {/if}
  {/if}
</div> 