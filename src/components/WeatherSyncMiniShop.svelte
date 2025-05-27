<script lang="ts">
  import { weatherStore } from '../stores/weather';
  import { getMiniShopData, trackPurchase, type Product } from '../lib/ecommerce';
  import { onMount } from 'svelte';

  let shopData: ReturnType<typeof getMiniShopData> | null = null;
  let selectedCategory = 0;
  let currentWeatherState = 'Sunny';

  // Generate shop data based on current weather
  $: if ($weatherStore.data) {
    // Simple weather state mapping for demo
    const temp = $weatherStore.data.current.temperature_2m;
    const precipitation = $weatherStore.data.current.precipitation;
    
    if (precipitation > 60) {
      currentWeatherState = 'Showery';
    } else if (temp > 30) {
      currentWeatherState = 'Hot_Sunny';
    } else if (temp < 10) {
      currentWeatherState = 'Cold';
    } else {
      currentWeatherState = 'Sunny';
    }
    
    shopData = getMiniShopData(currentWeatherState);
  }

  function handlePurchaseClick(product: Product) {
    // Track the purchase intent
    trackPurchase({
      productId: product.id,
      productName: product.name,
      store: product.store,
      price: product.price,
      timestamp: new Date().toISOString(),
      weatherState: currentWeatherState,
      category: product.category
    });

    // Open affiliate link
    window.open(product.affiliateLink, '_blank');
  }

  function getStoreColor(store: string): string {
    const colors: Record<string, string> = {
      'amazon': 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
      'nike': 'bg-black text-white dark:bg-gray-800 dark:text-gray-200',
      'zappos': 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
      'instacart': 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
      'eventbrite': 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200'
    };
    return colors[store] || 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
  }

  function getCategoryColor(category: string): string {
    const colors: Record<string, string> = {
      'wardrobe': 'bg-purple-50 border-purple-200 dark:bg-purple-900/20 dark:border-purple-700',
      'fitness': 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-700',
      'food': 'bg-orange-50 border-orange-200 dark:bg-orange-900/20 dark:border-orange-700',
      'activity': 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-700'
    };
    return colors[category] || 'bg-gray-50 border-gray-200 dark:bg-gray-900/20 dark:border-gray-700';
  }

  onMount(() => {
    if (!shopData) {
      shopData = getMiniShopData('Sunny'); // Default fallback
    }
  });
</script>

<div class="glass-card-lg p-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300 hover:scale-105">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-xl font-bold text-glass flex items-center">
      <span class="text-2xl mr-3">🛍️</span>
      WeatherSync Mini-Shop
    </h2>
    <div class="text-sm text-glass-secondary">
      {currentWeatherState} Weather Essentials
    </div>
  </div>

  {#if !shopData}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-3">🏪</div>
      <p class="text-gray-600 dark:text-gray-400">Loading shop...</p>
    </div>
  {:else}
    <!-- Category Tabs -->
    <div class="flex space-x-1 mb-6 glass-card rounded-glass-lg p-1">
      {#each shopData.categories as category, index}
        <button
          on:click={() => selectedCategory = index}
          class="glass-button flex-1 px-3 py-2 rounded-glass text-sm font-medium transition-all duration-200 {selectedCategory === index ? 'bg-blue-500/20 dark:bg-blue-600/30 text-blue-800 dark:text-blue-200 border border-blue-300/50 dark:border-blue-500/50' : 'text-glass-secondary hover:text-glass hover:bg-white/30 dark:hover:bg-slate-800/40'}"
        >
          <span class="mr-1">{category.emoji}</span>
          {category.name}
        </button>
      {/each}
    </div>

    <!-- Products Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {#each shopData.categories[selectedCategory].products as product}
        <div class="product-card border rounded-lg p-4 hover:shadow-lg transition-all duration-200 {getCategoryColor(product.category)}" tabindex="0">
          <!-- Product Header -->
          <div class="flex items-start justify-between mb-3">
            <div class="flex-1">
              <h3 class="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                {product.name}
              </h3>
              <p class="text-xs text-gray-600 dark:text-gray-400 mb-2">
                {product.description}
              </p>
            </div>
            <span class="text-xs px-2 py-1 rounded {getStoreColor(product.store)} ml-2">
              {product.store}
            </span>
          </div>

          <!-- Weather Suitability -->
          <div class="mb-3">
            <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
              Perfect for:
            </div>
            <div class="flex flex-wrap gap-1">
              {#each product.weatherSuitability as weather}
                <span class="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200 px-2 py-1 rounded">
                  {weather}
                </span>
              {/each}
            </div>
          </div>

          <!-- Price and Purchase -->
          <div class="flex items-center justify-between">
            <div class="text-lg font-bold text-gray-900 dark:text-white">
              {product.price}
            </div>
            <button
              on:click={() => handlePurchaseClick(product)}
              class="glass-button px-4 py-2 bg-blue-500/20 dark:bg-blue-600/30 text-blue-800 dark:text-blue-200 border border-blue-300/50 dark:border-blue-500/50 hover:bg-blue-500/30 dark:hover:bg-blue-600/40 transition-all duration-200 text-sm font-medium"
            >
              Shop Now
            </button>
          </div>

          <!-- Category Badge -->
          <div class="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
            <span class="text-xs font-medium text-gray-500 dark:text-gray-400">
              {product.category === 'wardrobe' ? '👗' : 
               product.category === 'fitness' ? '💪' : 
               product.category === 'food' ? '🍽️' : '🎯'} 
              {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
            </span>
          </div>
        </div>
      {/each}
    </div>

    <!-- Empty State -->
    {#if shopData.categories[selectedCategory].products.length === 0}
      <div class="text-center py-8">
        <div class="text-gray-400 text-3xl mb-2">📦</div>
        <p class="text-gray-600 dark:text-gray-400">No products available for this category</p>
      </div>
    {/if}

    <!-- Weather-Specific Recommendations -->
    <div class="mt-8 p-4 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-2 flex items-center">
        <span class="text-xl mr-2">🎯</span>
        {currentWeatherState} Weather Recommendations
      </h3>
      <p class="text-sm text-gray-600 dark:text-gray-400 mb-3">
        Based on current weather conditions, here are our top picks to help you make the most of your day.
      </p>
      
      <!-- Quick Stats -->
      <div class="grid grid-cols-3 gap-4 text-center">
        <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
          <div class="text-lg font-bold text-blue-600 dark:text-blue-400">
            {shopData.categories.reduce((sum, cat) => sum + cat.products.length, 0)}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Products</div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
          <div class="text-lg font-bold text-green-600 dark:text-green-400">
            {shopData.categories.length}
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Categories</div>
        </div>
        <div class="bg-white dark:bg-gray-800 p-3 rounded-lg">
          <div class="text-lg font-bold text-purple-600 dark:text-purple-400">
            5
          </div>
          <div class="text-xs text-gray-600 dark:text-gray-400">Stores</div>
        </div>
      </div>
    </div>

    <!-- Affiliate Disclosure -->
    <div class="mt-6 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <p class="text-xs text-gray-600 dark:text-gray-400">
        <span class="font-medium">💡 Affiliate Disclosure:</span> 
        WeatherSync may earn a commission from purchases made through these links. 
        This helps us provide free weather-driven recommendations while supporting our service.
      </p>
    </div>
  {/if}
</div>

<style>
  .product-card:hover {
    @apply transform scale-105;
  }
  .product-card:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
  }
  .product-card {
    @apply transition-all duration-200;
  }
</style> 