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
  <div class="glass-card-lg p-6 hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300">
    <h2 class="text-xl font-bold text-glass mb-4 flex items-center">
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
        class="glass-input w-full px-4 py-3 text-glass placeholder-glass-muted"
        aria-label="Search for a city"
      />
      
      {#if searching}
        <div class="absolute right-3 top-3">
          <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
        </div>
      {/if}
      
      <!-- Search Results Dropdown -->
      {#if showResults && results.length > 0}
        <div class="absolute top-full left-0 right-0 mt-2 glass-card-lg rounded-glass-lg shadow-glass-lg z-50 max-h-60 overflow-y-auto">
          {#each results as city}
            <button
              type="button"
              on:click|stopPropagation={() => selectCity(city)}
              class="w-full px-4 py-3 text-left hover:bg-white/40 dark:hover:bg-slate-800/50 border-b border-glass-light-border dark:border-glass-dark-border last:border-b-0 transition-all duration-200"
            >
              <div class="font-medium text-glass">
                {city.name}
              </div>
              <div class="text-sm text-glass-secondary">
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
        <div class="absolute top-full left-0 right-0 mt-2 glass-card-lg rounded-glass-lg shadow-glass-lg z-50 p-4 text-center">
          <div class="text-glass-secondary">
            No cities found for "{query}"
          </div>
        </div>
      {/if}
    </div>
    
    <div class="mt-3 text-sm text-glass-muted">
      Type at least 2 characters to search for cities
    </div>
  </div>
</div>

<style>
  .city-search {
    position: relative;
  }
</style> 