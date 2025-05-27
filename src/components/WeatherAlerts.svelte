<script lang="ts">
  import { weatherStore } from '../stores/weather';
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  
  interface WeatherAlert {
    id: string;
    type: 'warning' | 'danger' | 'info';
    title: string;
    message: string;
    icon: string;
    dismissible: boolean;
  }
  
  let alerts: WeatherAlert[] = [];
  let dismissedAlerts: string[] = [];
  
  onMount(() => {
    // Load dismissed alerts from localStorage
    if (browser) {
      const dismissed = localStorage.getItem('dismissedWeatherAlerts');
      if (dismissed) {
        try {
          dismissedAlerts = JSON.parse(dismissed);
        } catch (error) {
          console.error('Error loading dismissed alerts:', error);
        }
      }
    }
  });
  
  // Generate alerts based on weather data
  $: {
    if ($weatherStore.data) {
      alerts = generateWeatherAlerts($weatherStore.data);
    } else {
      alerts = [];
    }
  }
  
  function generateWeatherAlerts(weather: any): WeatherAlert[] {
    const newAlerts: WeatherAlert[] = [];
    const current = weather.current;
    
    // High precipitation alert
    if (current.precipitation > 10) {
      newAlerts.push({
        id: 'heavy-rain',
        type: 'warning',
        title: 'Heavy Rain Alert',
        message: `Heavy rainfall detected (${current.precipitation}mm/h). Consider staying indoors and avoid driving if possible.`,
        icon: '🌧️',
        dismissible: true
      });
    }
    
    // Strong wind alert
    if (current.windSpeed > 50) {
      newAlerts.push({
        id: 'strong-wind',
        type: 'danger',
        title: 'Strong Wind Warning',
        message: `Very strong winds detected (${current.windSpeed} km/h). Avoid outdoor activities and secure loose objects.`,
        icon: '💨',
        dismissible: true
      });
    } else if (current.windSpeed > 30) {
      newAlerts.push({
        id: 'moderate-wind',
        type: 'warning',
        title: 'Windy Conditions',
        message: `Strong winds detected (${current.windSpeed} km/h). Be cautious when outdoors.`,
        icon: '🌬️',
        dismissible: true
      });
    }
    
    // Extreme temperature alerts
    if (current.temperature > 35) {
      newAlerts.push({
        id: 'extreme-heat',
        type: 'danger',
        title: 'Extreme Heat Warning',
        message: `Very high temperature (${current.temperature}°C). Stay hydrated, seek shade, and limit outdoor activities.`,
        icon: '🔥',
        dismissible: true
      });
    } else if (current.temperature < -10) {
      newAlerts.push({
        id: 'extreme-cold',
        type: 'danger',
        title: 'Extreme Cold Warning',
        message: `Very low temperature (${current.temperature}°C). Dress warmly and limit time outdoors.`,
        icon: '🥶',
        dismissible: true
      });
    }
    
    // High humidity alert
    if (current.humidity > 90) {
      newAlerts.push({
        id: 'high-humidity',
        type: 'info',
        title: 'High Humidity',
        message: `Very high humidity (${current.humidity}%). You may feel uncomfortable. Stay hydrated and seek air conditioning.`,
        icon: '💧',
        dismissible: true
      });
    }
    
    // Thunderstorm alert
    if (current.weatherCode >= 95 && current.weatherCode <= 99) {
      newAlerts.push({
        id: 'thunderstorm',
        type: 'warning',
        title: 'Thunderstorm Alert',
        message: 'Thunderstorm conditions detected. Stay indoors and avoid using electrical devices.',
        icon: '⛈️',
        dismissible: true
      });
    }
    
    // Snow alert
    if (current.weatherCode >= 71 && current.weatherCode <= 86) {
      newAlerts.push({
        id: 'snow',
        type: 'info',
        title: 'Snow Conditions',
        message: 'Snow is falling. Drive carefully and dress warmly.',
        icon: '❄️',
        dismissible: true
      });
    }
    
    // Filter out dismissed alerts
    return newAlerts.filter(alert => !dismissedAlerts.includes(alert.id));
  }
  
  function dismissAlert(alertId: string) {
    dismissedAlerts = [...dismissedAlerts, alertId];
    alerts = alerts.filter(alert => alert.id !== alertId);
    
    // Save to localStorage
    if (browser) {
      localStorage.setItem('dismissedWeatherAlerts', JSON.stringify(dismissedAlerts));
    }
  }
  
  function getAlertClasses(type: string): string {
    const baseClasses = 'glass-card p-4 border-l-4 backdrop-blur-glass-lg transition-all duration-300 hover:bg-white/40 dark:hover:bg-slate-800/50';
    switch (type) {
      case 'danger':
        return `${baseClasses} border-l-red-500 bg-red-50/30 dark:bg-red-900/20 text-red-800 dark:text-red-200`;
      case 'warning':
        return `${baseClasses} border-l-yellow-500 bg-yellow-50/30 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-200`;
      case 'info':
        return `${baseClasses} border-l-blue-500 bg-blue-50/30 dark:bg-blue-900/20 text-blue-800 dark:text-blue-200`;
      default:
        return `${baseClasses} border-l-gray-500 bg-gray-50/30 dark:bg-gray-900/20 text-gray-800 dark:text-gray-200`;
    }
  }
  
  function clearAllAlerts() {
    const allAlertIds = alerts.map(alert => alert.id);
    dismissedAlerts = [...dismissedAlerts, ...allAlertIds];
    alerts = [];
    if (browser) {
      localStorage.setItem('dismissedWeatherAlerts', JSON.stringify(dismissedAlerts));
    }
  }
  
  function resetDismissedAlerts() {
    dismissedAlerts = [];
    if (browser) {
      localStorage.removeItem('dismissedWeatherAlerts');
    }
    // Regenerate alerts
    if ($weatherStore.data) {
      alerts = generateWeatherAlerts($weatherStore.data);
    }
  }
</script>

{#if alerts.length > 0}
  <div class="space-y-3">
    <!-- Alert Header -->
    <div class="glass-card-lg p-4 mb-4 flex items-center justify-between hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-300">
      <h3 class="text-lg font-semibold text-glass flex items-center">
        <span class="text-2xl mr-2">⚠️</span>
        Weather Alerts
        <span class="ml-2 px-2 py-1 text-xs glass-card rounded-full bg-red-50/50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200/50 dark:border-red-700/50">
          {alerts.length}
        </span>
      </h3>
      
      {#if alerts.length > 1}
        <button
          on:click={clearAllAlerts}
          class="glass-button text-sm text-glass-secondary hover:text-glass transition-all duration-200"
        >
          Dismiss All
        </button>
      {/if}
    </div>
    
    <!-- Alert List -->
    {#each alerts as alert}
      <div class="{getAlertClasses(alert.type)} animate-fade-in" tabindex="0">
        <div class="flex items-start justify-between">
          <div class="flex items-start space-x-3">
            <span class="text-2xl animate-pulse">{alert.icon}</span>
            <div class="flex-1">
              <h4 class="font-semibold mb-1">{alert.title}</h4>
              <p class="text-sm opacity-90">{alert.message}</p>
            </div>
          </div>
          
          {#if alert.dismissible}
            <button
              on:click={() => dismissAlert(alert.id)}
              class="ml-4 p-1 glass-card rounded-glass hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 backdrop-blur-glass"
              aria-label="Dismiss alert"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          {/if}
        </div>
      </div>
    {/each}
    
    <!-- Reset Button (for development/testing) -->
    {#if dismissedAlerts.length > 0}
      <div class="text-center pt-2">
        <button
          on:click={resetDismissedAlerts}
          class="glass-button text-xs text-glass-muted hover:text-glass-secondary transition-all duration-200"
        >
          Reset dismissed alerts
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  @keyframes fade-in {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in {
    animation: fade-in 0.3s ease-out;
  }
  .glass-card:focus-visible,
  .glass-card-lg:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
  }
</style> 