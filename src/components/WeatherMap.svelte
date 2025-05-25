<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { weatherData } from '../stores/weather';
  
  let mapContainer: HTMLDivElement;
  let map: any;
  let leafletLoaded = false;

  interface ActivityPin {
    id: string;
    name: string;
    type: 'indoor' | 'outdoor';
    lat: number;
    lng: number;
    weatherSuitability: string;
    ticketLink?: string;
    description: string;
    emoji: string;
  }

  let activityPins: ActivityPin[] = [];

  // Mock activity data - in real implementation, this would come from APIs
  function generateActivityPins(weather: any) {
    if (!weather?.location) return;

    const { latitude, longitude } = weather.location;
    
    // Generate some mock activities around the current location
    activityPins = [
      {
        id: '1',
        name: 'Art Gallery Downtown',
        type: 'indoor',
        lat: latitude + 0.01,
        lng: longitude + 0.01,
        weatherSuitability: 'Perfect for rainy weather',
        ticketLink: 'https://eventbrite.com/art-gallery',
        description: 'Contemporary art exhibition',
        emoji: '🎨'
      },
      {
        id: '2',
        name: 'Central Park',
        type: 'outdoor',
        lat: latitude - 0.01,
        lng: longitude + 0.02,
        weatherSuitability: 'Great for sunny days',
        ticketLink: 'https://eventbrite.com/park-events',
        description: 'Outdoor activities and events',
        emoji: '🌳'
      },
      {
        id: '3',
        name: 'Farmers Market',
        type: 'outdoor',
        lat: latitude + 0.02,
        lng: longitude - 0.01,
        weatherSuitability: 'Best in mild weather',
        ticketLink: 'https://eventbrite.com/farmers-market',
        description: 'Fresh local produce and crafts',
        emoji: '🥕'
      },
      {
        id: '4',
        name: 'Indoor Climbing Gym',
        type: 'indoor',
        lat: latitude - 0.02,
        lng: longitude - 0.02,
        weatherSuitability: 'Perfect for any weather',
        ticketLink: 'https://eventbrite.com/climbing-gym',
        description: 'Rock climbing and fitness',
        emoji: '🧗'
      }
    ];
  }

  async function loadLeaflet() {
    if (typeof window === 'undefined') return;
    
    try {
      // Dynamically import Leaflet
      const L = await import('leaflet');
      
      // Load CSS
      if (!document.querySelector('link[href*="leaflet.css"]')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
        document.head.appendChild(link);
      }

      leafletLoaded = true;
      return L.default || L;
    } catch (error) {
      console.error('Failed to load Leaflet:', error);
      return null;
    }
  }

  async function initializeMap() {
    if (!mapContainer || !$weatherData?.location || !leafletLoaded) return;

    const L = await loadLeaflet();
    if (!L) return;

    const { latitude, longitude } = $weatherData.location;

    // Initialize map
    map = L.map(mapContainer).setView([latitude, longitude], 12);

    // Add tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add weather overlay (mock implementation)
    addWeatherOverlay(L, latitude, longitude);

    // Add activity pins
    addActivityPins(L);
  }

  function addWeatherOverlay(L: any, lat: number, lng: number) {
    if (!$weatherData) return;

    const currentWeather = $weatherData.current;
    let overlayColor = '#3B82F6'; // Default blue
    let overlayOpacity = 0.3;

    // Determine overlay based on weather conditions
    if (currentWeather.precipitation > 0) {
      overlayColor = '#1E40AF'; // Dark blue for rain
      overlayOpacity = 0.5;
    } else if (currentWeather.temperature > 30) {
      overlayColor = '#DC2626'; // Red for hot
      overlayOpacity = 0.4;
    } else if (currentWeather.temperature < 10) {
      overlayColor = '#6B7280'; // Gray for cold
      overlayOpacity = 0.4;
    }

    // Create weather overlay circle
    const weatherCircle = L.circle([lat, lng], {
      color: overlayColor,
      fillColor: overlayColor,
      fillOpacity: overlayOpacity,
      radius: 5000 // 5km radius
    }).addTo(map);

    // Add weather info popup
    weatherCircle.bindPopup(`
      <div class="text-center">
        <h3 class="font-bold">${$weatherData.location.name}</h3>
        <p>${currentWeather.temperature}°C</p>
        <p>${currentWeather.precipitation > 0 ? '🌧️ Rainy' : currentWeather.temperature > 25 ? '☀️ Sunny' : '☁️ Cloudy'}</p>
      </div>
    `);
  }

  function addActivityPins(L: any) {
    activityPins.forEach(pin => {
      const icon = L.divIcon({
        html: `
          <div class="activity-pin ${pin.type === 'indoor' ? 'indoor' : 'outdoor'}">
            <span class="text-lg">${pin.emoji}</span>
          </div>
        `,
        className: 'custom-div-icon',
        iconSize: [40, 40],
        iconAnchor: [20, 20]
      });

      const marker = L.marker([pin.lat, pin.lng], { icon }).addTo(map);

      marker.bindPopup(`
        <div class="activity-popup">
          <h3 class="font-bold text-lg mb-2">${pin.emoji} ${pin.name}</h3>
          <p class="text-sm text-gray-600 mb-2">${pin.description}</p>
          <p class="text-xs text-blue-600 mb-3">${pin.weatherSuitability}</p>
          <button 
            onclick="window.open('${pin.ticketLink}', '_blank')"
            class="w-full bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700"
          >
            Buy Tickets
          </button>
        </div>
      `);
    });
  }

  onMount(async () => {
    await loadLeaflet();
    if ($weatherData) {
      generateActivityPins($weatherData);
      await initializeMap();
    }
  });

  onDestroy(() => {
    if (map) {
      map.remove();
    }
  });

  // Reactive updates
  $: if ($weatherData && leafletLoaded) {
    generateActivityPins($weatherData);
    if (map) {
      map.remove();
    }
    initializeMap();
  }
</script>

<div class="weather-card">
  <div class="flex items-center justify-between mb-4">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-3">🗺️</span>
      Weather Map
    </h2>
    <div class="text-sm text-gray-500 dark:text-gray-400">
      Activities & Weather Overlay
    </div>
  </div>

  <!-- Map Container -->
  <div class="relative">
    <div 
      bind:this={mapContainer} 
      class="w-full h-96 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
    >
      {#if !leafletLoaded}
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="text-4xl mb-2">🌍</div>
            <p class="text-gray-600 dark:text-gray-400">Loading map...</p>
          </div>
        </div>
      {/if}
    </div>

    <!-- Map Legend -->
    <div class="absolute top-4 right-4 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
      <h4 class="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Legend</h4>
      <div class="space-y-1 text-xs">
        <div class="flex items-center space-x-2">
          <div class="w-3 h-3 rounded-full bg-blue-500 opacity-50"></div>
          <span class="text-gray-600 dark:text-gray-400">Weather Area</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="activity-pin indoor w-6 h-6 flex items-center justify-center">🏢</div>
          <span class="text-gray-600 dark:text-gray-400">Indoor Activity</span>
        </div>
        <div class="flex items-center space-x-2">
          <div class="activity-pin outdoor w-6 h-6 flex items-center justify-center">🌳</div>
          <span class="text-gray-600 dark:text-gray-400">Outdoor Activity</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Activity List -->
  <div class="mt-6">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <span class="text-xl mr-2">📍</span>
      Nearby Activities
    </h3>
    
    {#if activityPins.length === 0}
      <div class="text-center py-6">
        <div class="text-gray-400 text-3xl mb-2">🎯</div>
        <p class="text-gray-600 dark:text-gray-400">Loading activities...</p>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        {#each activityPins as pin}
          <div class="activity-card p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center space-x-2">
                <span class="text-xl">{pin.emoji}</span>
                <h4 class="font-semibold text-gray-900 dark:text-white">{pin.name}</h4>
              </div>
              <span class="text-xs px-2 py-1 rounded {pin.type === 'indoor' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200' : 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200'}">
                {pin.type}
              </span>
            </div>
            
            <p class="text-sm text-gray-600 dark:text-gray-400 mb-2">{pin.description}</p>
            <p class="text-xs text-blue-600 dark:text-blue-400 mb-3">{pin.weatherSuitability}</p>
            
            <button 
              on:click={() => window.open(pin.ticketLink, '_blank')}
              class="w-full bg-blue-600 text-white px-3 py-2 rounded text-sm hover:bg-blue-700 transition-colors"
            >
              Buy Tickets
            </button>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>

<style>
  :global(.custom-div-icon) {
    background: none !important;
    border: none !important;
  }

  :global(.activity-pin) {
    @apply w-8 h-8 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2;
  }

  :global(.activity-pin.indoor) {
    @apply bg-blue-600 border-blue-400;
  }

  :global(.activity-pin.outdoor) {
    @apply bg-green-600 border-green-400;
  }

  :global(.activity-popup) {
    @apply min-w-48;
  }

  .activity-card:hover {
    @apply transform scale-105;
  }
</style> 