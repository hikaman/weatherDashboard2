<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import { initializeWeather } from '../stores/weather';
  import WeatherDisplay from './WeatherDisplay.svelte';
  import WeatherAlerts from './WeatherAlerts.svelte';
  import CitySearch from './CitySearch.svelte';
  import WardrobeSuggestions from './WardrobeSuggestions.svelte';
  import ActivitySuggestions from './ActivitySuggestions.svelte';
  import FoodSuggestions from './FoodSuggestions.svelte';
  import ExerciseSuggestions from './ExerciseSuggestions.svelte';
  import DecisionTimeline from './DecisionTimeline.svelte';
  import WeatherMap from './WeatherMap.svelte';
  import DecisionJournal from './DecisionJournal.svelte';
  import WeatherSyncMiniShop from './WeatherSyncMiniShop.svelte';
  
  // Suggestion visibility toggles
  let showWardrobe = true;
  let showActivities = true;
  let showFood = true;
  let showExercise = true;
  
  // New component visibility toggles
  let showTimeline = true;
  let showMap = true;
  let showJournal = true;
  let showMiniShop = true;
  
  // Dark mode state
  let darkMode = false;
  
  onMount(() => {
    // Initialize weather data when component mounts
    initializeWeather();
    
    // Check for saved theme preference or default to light mode
    if (browser) {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        darkMode = true;
        document.documentElement.classList.add('dark');
      }
      
      // Load saved filter preferences
      const savedFilters = localStorage.getItem('suggestionFilters');
      if (savedFilters) {
        try {
          const filters = JSON.parse(savedFilters);
          showWardrobe = filters.wardrobe ?? true;
          showActivities = filters.activities ?? true;
          showFood = filters.food ?? true;
          showExercise = filters.exercise ?? true;
        } catch (error) {
          console.error('Error loading saved filters:', error);
        }
      }
    }
  });
  
  // Save filter preferences when they change
  $: if (browser) {
    const filters = {
      wardrobe: showWardrobe,
      activities: showActivities,
      food: showFood,
      exercise: showExercise
    };
    localStorage.setItem('suggestionFilters', JSON.stringify(filters));
  }
  
  function toggleDarkMode() {
    if (!browser) return;
    
    darkMode = !darkMode;
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }
  
  function toggleFilter(type: string) {
    switch (type) {
      case 'wardrobe':
        showWardrobe = !showWardrobe;
        break;
      case 'activities':
        showActivities = !showActivities;
        break;
      case 'food':
        showFood = !showFood;
        break;
      case 'exercise':
        showExercise = !showExercise;
        break;
    }
  }
  
  function getFilterButtonClass(isActive: boolean): string {
    return isActive
      ? 'bg-blue-500 text-white border-blue-500 hover:bg-blue-600'
      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700';
  }
</script>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
  <div class="container mx-auto px-4 py-8">
    
    <!-- Header -->
    <header class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-8 space-y-4 sm:space-y-0">
      <div>
        <h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-2">
          WeatherSync Decision Hub
        </h1>
        <p class="text-gray-600 dark:text-gray-300">
          Make informed, weather-driven decisions about wardrobe, fitness, meals, and activities
        </p>
      </div>
      
      <!-- Dark Mode Toggle -->
      <button
        on:click={toggleDarkMode}
        class="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200 self-start sm:self-auto"
        aria-label="Toggle dark mode"
      >
        {#if darkMode}
          <svg class="w-6 h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clip-rule="evenodd"></path>
          </svg>
        {:else}
          <svg class="w-6 h-6 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"></path>
          </svg>
        {/if}
      </button>
    </header>
    
    <!-- Weather Alerts (Full Width) -->
    <div class="mb-8">
      <WeatherAlerts />
    </div>
    
    <!-- Decision Timeline - Full Width -->
    {#if showTimeline}
      <div class="mb-8">
        <DecisionTimeline />
      </div>
    {/if}

    <!-- Main Dashboard Grid -->
    <div class="grid grid-cols-1 xl:grid-cols-4 gap-8">
      
      <!-- Weather Section - Takes up more space on larger screens -->
      <section class="xl:col-span-2 space-y-6">
        <CitySearch />
        <WeatherDisplay />
        
        <!-- Weather Map -->
        {#if showMap}
          <WeatherMap />
        {/if}
      </section>
      
      <!-- Suggestions Section -->
      <section class="xl:col-span-2 space-y-6">
        
        <!-- Suggestion Filters -->
        <div class="weather-card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span class="text-2xl mr-2">🎛️</span>
            Suggestion Filters
          </h3>
          
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              on:click={() => toggleFilter('wardrobe')}
              class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 {getFilterButtonClass(showWardrobe)}"
            >
              <span>👗</span>
              <span>Wardrobe</span>
            </button>
            
            <button
              on:click={() => toggleFilter('activities')}
              class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 {getFilterButtonClass(showActivities)}"
            >
              <span>🎯</span>
              <span>Activities</span>
            </button>
            
            <button
              on:click={() => toggleFilter('food')}
              class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 {getFilterButtonClass(showFood)}"
            >
              <span>🍽️</span>
              <span>Food</span>
            </button>
            
            <button
              on:click={() => toggleFilter('exercise')}
              class="px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 flex items-center justify-center space-x-2 {getFilterButtonClass(showExercise)}"
            >
              <span>💪</span>
              <span>Exercise</span>
            </button>
          </div>
          
          <div class="mt-3 text-xs text-gray-500 dark:text-gray-400">
            Toggle categories to customize your suggestions
          </div>
        </div>
        
        <!-- Suggestion Components -->
        <div class="space-y-6">
          {#if showWardrobe}
            <div class="animate-fade-in">
              <WardrobeSuggestions />
            </div>
          {/if}
          
          {#if showActivities}
            <div class="animate-fade-in">
              <ActivitySuggestions />
            </div>
          {/if}
          
          {#if showFood}
            <div class="animate-fade-in">
              <FoodSuggestions />
            </div>
          {/if}
          
          {#if showExercise}
            <div class="animate-fade-in">
              <ExerciseSuggestions />
            </div>
          {/if}
          
          {#if !showWardrobe && !showActivities && !showFood && !showExercise}
            <div class="weather-card text-center py-12">
              <div class="text-gray-400 text-6xl mb-4">🎭</div>
              <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
                No Suggestions Selected
              </h3>
              <p class="text-gray-600 dark:text-gray-400 mb-4">
                Enable at least one suggestion category above to see personalized recommendations.
              </p>
              <button
                on:click={() => {
                  showWardrobe = true;
                  showActivities = true;
                  showFood = true;
                  showExercise = true;
                }}
                class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-200"
              >
                Enable All Suggestions
              </button>
            </div>
          {/if}
        </div>
      </section>
    </div>

    <!-- WeatherSync Mini-Shop - Full Width -->
    {#if showMiniShop}
      <div class="mt-8">
        <WeatherSyncMiniShop />
      </div>
    {/if}

    <!-- Decision Journal - Full Width -->
    {#if showJournal}
      <div class="mt-8">
        <DecisionJournal />
      </div>
    {/if}
    
    <!-- Mobile-optimized layout for smaller screens -->
    <div class="xl:hidden mt-8">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Quick Stats Card -->
        <div class="weather-card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span class="text-2xl mr-2">📊</span>
            Quick Stats
          </h3>
          <div class="grid grid-cols-2 gap-4 text-sm">
            <div class="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div class="font-semibold text-blue-600 dark:text-blue-400">Active Filters</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">
                {[showWardrobe, showActivities, showFood, showExercise].filter(Boolean).length}
              </div>
            </div>
            <div class="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div class="font-semibold text-green-600 dark:text-green-400">Categories</div>
              <div class="text-2xl font-bold text-gray-900 dark:text-white">4</div>
            </div>
          </div>
        </div>
        
        <!-- Tips Card -->
        <div class="weather-card">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <span class="text-2xl mr-2">💡</span>
            Tips
          </h3>
          <div class="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <div class="flex items-start space-x-2">
              <span class="text-blue-500 mt-0.5">•</span>
              <span>Suggestions update automatically with weather changes</span>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-green-500 mt-0.5">•</span>
              <span>Toggle filters to customize your experience</span>
            </div>
            <div class="flex items-start space-x-2">
              <span class="text-purple-500 mt-0.5">•</span>
              <span>Data is cached for offline access</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
</style> 