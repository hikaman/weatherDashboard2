<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { searchCities, fetchWeatherData, type GeocodingResult } from '../stores/weather';
  import { t } from '../lib/i18n';
  import { setLastCity } from '../stores/lastCity';
  
  export let currentLocation: string | null = null;
  
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
    
    // Create location name
    const locationName = city.admin1 ? `${city.name}, ${city.admin1}` : city.name;
    
    // Fetch weather for selected city
    await fetchWeatherData(city.latitude, city.longitude, locationName);
    
    // Persist last searched city
    setLastCity({ name: city.name, latitude: city.latitude, longitude: city.longitude });
    
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

<div class="city-search flex items-center gap-2">
  <div class="relative w-full max-w-xs">
      <input
        type="text"
        bind:value={query}
        on:keydown={handleKeydown}
        on:click|stopPropagation
        placeholder={$t.enterCityName}
      class="glass-input w-full px-2 py-1 text-sm text-glass placeholder-glass-muted"
        aria-label="Search for a city"
      />
      {#if searching}
      <div class="absolute right-2 top-2">
        <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        </div>
      {/if}
      <!-- Search Results Dropdown -->
      {#if showResults && results.length > 0}
      <div class="absolute top-full left-0 right-0 mt-1 glass-card-lg rounded-glass-lg shadow-glass-lg z-50 max-h-60 overflow-y-auto" aria-live="polite">
          {#each results as city}
            <button
              type="button"
              on:click|stopPropagation={() => selectCity(city)}
            class="w-full px-3 py-2 text-left hover:bg-white/40 dark:hover:bg-slate-800/50 border-b border-glass-light-border dark:border-glass-dark-border last:border-b-0 transition-all duration-200"
            >
              <div class="font-medium text-glass">
                {city.name}
              </div>
            <div class="text-xs text-glass-secondary">
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
      <div class="absolute top-full left-0 right-0 mt-1 glass-card-lg rounded-glass-lg shadow-glass-lg z-50 p-2 text-center">
        <div class="text-glass-secondary text-xs">
            {$t.noCitiesFound} "{query}"
          </div>
        </div>
      {/if}
  </div>
</div>

<style>
  .city-search {
    position: relative;
  }
  .glass-input {
    background: rgba(255,255,255,0.7);
    border-radius: 0.75rem;
    border: 1.5px solid rgba(56,189,248,0.18);
    box-shadow: 0 1px 6px rgba(56,189,248,0.08);
    color: #222;
    transition: border 0.2s, box-shadow 0.2s;
  }
  .glass-input:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
    border-color: #38bdf8;
    background: rgba(255,255,255,0.95);
  }
  /* Dark mode fix for input contrast */
  :global(html.dark) .glass-input {
    background: rgba(30,41,59,0.95);
    color: #f3f4f6;
    border: 1.5px solid rgba(56,189,248,0.28);
  }
  :global(html.dark) .glass-input::placeholder {
    color: #a0aec0;
    opacity: 1;
  }
  .glass-input::placeholder {
    color: #888;
    opacity: 1;
  }
  .city-search .relative {
    z-index: 30;
  }
  .city-search .glass-card-lg {
    z-index: 50;
    background: rgba(255,255,255,0.95);
    border-radius: 0.75rem;
    box-shadow: 0 4px 24px rgba(30,144,255,0.12);
    border: 1.5px solid rgba(56,189,248,0.18);
    margin-top: 0.25rem;
    padding: 0.25rem 0;
  }
  .city-search .glass-card-lg button {
    border-radius: 0.5rem;
    margin-bottom: 0.15rem;
  }
  .city-search .glass-card-lg button:last-child {
    margin-bottom: 0;
  }
</style> 