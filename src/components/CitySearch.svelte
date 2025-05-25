<script lang="ts">
  import { browser } from '$app/environment';
  import { searchCities, fetchWeatherData, type LocationData } from '../stores/weather';
  
  let searchQuery = '';
  let searchResults: LocationData[] = [];
  let isSearching = false;
  let showDropdown = false;
  let searchTimeout: number;
  
  // Debounced search function
  async function handleSearch() {
    if (searchQuery.length < 2) {
      searchResults = [];
      showDropdown = false;
      return;
    }
    
    isSearching = true;
    
    try {
      const results = await searchCities(searchQuery);
      searchResults = results;
      showDropdown = results.length > 0;
    } catch (error) {
      console.error('Search error:', error);
      searchResults = [];
      showDropdown = false;
    } finally {
      isSearching = false;
    }
  }
  
  // Handle input changes with debouncing
  function onInput() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(handleSearch, 300);
  }
  
  // Select a city from search results
  async function selectCity(city: LocationData) {
    searchQuery = `${city.name}, ${city.country}`;
    showDropdown = false;
    searchResults = [];
    
    // Fetch weather data for selected city
    await fetchWeatherData(city.latitude, city.longitude, `${city.name}, ${city.country}`);
    
    // Save selected city to localStorage
    if (browser) {
      localStorage.setItem('lastSelectedCity', JSON.stringify(city));
    }
  }
  
  // Clear search
  function clearSearch() {
    searchQuery = '';
    searchResults = [];
    showDropdown = false;
  }
  
  // Handle keyboard navigation
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      showDropdown = false;
    }
  }
  
  // Close dropdown when clicking outside
  function handleClickOutside() {
    showDropdown = false;
  }
</script>

<svelte:window on:click={handleClickOutside} />

<div class="relative">
  <div class="weather-card">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <span class="text-2xl mr-2">🔍</span>
      Search Location
    </h3>
    
    <div class="relative">
      <!-- Search Input -->
      <div class="relative">
        <input
          type="text"
          bind:value={searchQuery}
          on:input={onInput}
          on:keydown={handleKeydown}
          on:focus={() => searchResults.length > 0 && (showDropdown = true)}
          placeholder="Search for a city..."
          class="w-full px-4 py-3 pl-10 pr-10 text-gray-900 dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        
        <!-- Search Icon -->
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
        </div>
        
        <!-- Loading/Clear Button -->
        <div class="absolute inset-y-0 right-0 pr-3 flex items-center">
          {#if isSearching}
            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500"></div>
          {:else if searchQuery}
            <button
              on:click={clearSearch}
              class="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
              aria-label="Clear search"
            >
              <svg class="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          {/if}
        </div>
      </div>
      
      <!-- Search Results Dropdown -->
      {#if showDropdown && searchResults.length > 0}
        <div class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {#each searchResults as city, index}
            <button
              on:click={() => selectCity(city)}
              class="w-full px-4 py-3 text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
            >
              <div class="flex items-center justify-between">
                <div>
                  <div class="font-medium text-gray-900 dark:text-white">
                    {city.name}
                  </div>
                  <div class="text-sm text-gray-600 dark:text-gray-400">
                    {city.admin1 ? `${city.admin1}, ` : ''}{city.country}
                  </div>
                </div>
                <div class="text-xs text-gray-500 dark:text-gray-400">
                  {city.latitude.toFixed(2)}, {city.longitude.toFixed(2)}
                </div>
              </div>
            </button>
          {/each}
        </div>
      {/if}
      
      <!-- No Results Message -->
      {#if showDropdown && searchResults.length === 0 && searchQuery.length >= 2 && !isSearching}
        <div class="absolute z-10 w-full mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4">
          <div class="text-center text-gray-600 dark:text-gray-400">
            <div class="text-2xl mb-2">🌍</div>
            <div class="text-sm">No cities found for "{searchQuery}"</div>
            <div class="text-xs mt-1">Try a different search term</div>
          </div>
        </div>
      {/if}
    </div>
    
    <!-- Search Tips -->
    <div class="mt-4 text-xs text-gray-500 dark:text-gray-400">
      <div class="flex items-center space-x-4">
        <span>💡 Try searching for major cities</span>
        <span>🌐 Results include country and region</span>
      </div>
    </div>
  </div>
</div> 