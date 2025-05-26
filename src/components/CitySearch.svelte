<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { searchCities, fetchWeatherData, type GeocodingResult } from '../stores/weather';
  
  const dispatch = createEventDispatcher<{ select: GeocodingResult }>();
  
  let query = '';
  let results: GeocodingResult[] = [];
  let showResults = false;
  let searching = false;
  
  // Debounce search to avoid too many API calls
  let searchTimeout: ReturnType<typeof setTimeout>;
  
  async function handleSearch() {
    if (query.length < 2) {
      results = [];
      showResults = false;
      return;
    }
    
    searching = true;
    try {
      results = await searchCities(query);
      showResults = results.length > 0;
    } catch (error) {
      console.error('Search error:', error);
      results = [];
      showResults = false;
    } finally {
      searching = false;
    }
  }
  
  function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearch, 300);
  }
  
  async function selectCity(city: GeocodingResult) {
    query = city.name;
    showResults = false;
    results = [];
    
    // Fetch weather for selected city
    await fetchWeatherData(city.latitude, city.longitude);
    
    // Dispatch selection event
    dispatch('select', city);
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showResults = false;
    }
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside() {
    showResults = false;
  }
  
  $: if (query) {
    debounceSearch();
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="city-search">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center">
      <span class="text-2xl mr-3">🔍</span>
      Search Location
    </h2>
    
    <div class="relative">
      <input
        type="text"
        bind:value={query}
        on:keydown={handleKeydown}
        on:click|stopPropagation
        placeholder="Enter city name..."
        class="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
        aria-label="Search for a city"
      />
      
      {#if searching}
        <div class="absolute right-3 top-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      {/if}
      
      <!-- Search Results Dropdown -->
      {#if showResults && results.length > 0}
        <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
          {#each results as city}
            <button
              type="button"
              on:click|stopPropagation={() => selectCity(city)}
              class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors"
            >
              <div class="font-medium text-gray-900 dark:text-white">
                {city.name}
              </div>
              <div class="text-sm text-gray-600 dark:text-gray-400">
                {city.country}
                {#if city.admin1}
                  • {city.admin1}
                {/if}
              </div>
            </button>
          {/each}
        </div>
      {/if}
      
      <!-- No Results Message -->
      {#if showResults && results.length === 0 && !searching && query.length >= 2}
        <div class="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 p-4 text-center">
          <div class="text-gray-500 dark:text-gray-400">
            No cities found for "{query}"
          </div>
        </div>
      {/if}
    </div>
    
    <div class="mt-3 text-sm text-gray-600 dark:text-gray-400">
      Type at least 2 characters to search for cities
    </div>
  </div>
</div>

<style>
  .city-search {
    position: relative;
  }
</style> 