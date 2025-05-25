<script lang="ts">
  import { weatherData, weatherLoading, weatherError, getWeatherDescription } from '../stores/weather';
  
  // Enhanced weather icon mapping with animations
  function getWeatherIcon(code: number): { icon: string; animation: string } {
    if (code === 0) return { icon: '☀️', animation: 'animate-pulse-slow' }; // Clear sky
    if (code >= 1 && code <= 3) return { icon: '⛅', animation: 'animate-bounce-slow' }; // Partly cloudy
    if (code >= 45 && code <= 48) return { icon: '🌫️', animation: 'animate-pulse' }; // Fog
    if (code >= 51 && code <= 67) return { icon: '🌧️', animation: 'animate-bounce' }; // Rain
    if (code >= 71 && code <= 86) return { icon: '❄️', animation: 'animate-spin' }; // Snow
    if (code >= 95 && code <= 99) return { icon: '⛈️', animation: 'animate-pulse' }; // Thunderstorm
    return { icon: '🌤️', animation: 'animate-pulse-slow' }; // Default
  }
  
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  }
  
  function isToday(dateString: string): boolean {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }
</script>

<div class="space-y-6">
  {#if $weatherLoading}
    <div class="weather-card">
      <div class="flex items-center justify-center py-12">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        <span class="ml-3 text-gray-600 dark:text-gray-300">Loading weather data...</span>
      </div>
    </div>
  {:else if $weatherError}
    <div class="weather-card border-red-200 dark:border-red-800">
      <div class="text-center py-8">
        <div class="text-red-500 text-4xl mb-4 animate-bounce">⚠️</div>
        <h3 class="text-lg font-semibold text-red-700 dark:text-red-300 mb-2">
          Weather Data Unavailable
        </h3>
        <p class="text-red-600 dark:text-red-400 text-sm">
          {$weatherError}
        </p>
      </div>
    </div>
  {:else if $weatherData}
    <!-- Current Weather Card -->
    <div class="weather-card">
      <div class="flex items-center justify-between mb-6">
        <div>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
            Current Weather
          </h2>
          <p class="text-gray-600 dark:text-gray-300">
            {$weatherData.location.name}
          </p>
        </div>
        <div class="text-right">
          <div class="text-sm text-gray-500 dark:text-gray-400">
            {new Date($weatherData.current.time).toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- Temperature and Condition -->
        <div class="text-center md:text-left">
          <div class="flex items-center justify-center md:justify-start space-x-4">
            <div class="text-6xl {getWeatherIcon($weatherData.current.weatherCode).animation}">
              {getWeatherIcon($weatherData.current.weatherCode).icon}
            </div>
            <div>
              <div class="text-5xl font-bold text-gray-900 dark:text-white">
                {$weatherData.current.temperature}°C
              </div>
              <div class="text-lg text-gray-600 dark:text-gray-300">
                {getWeatherDescription($weatherData.current.weatherCode)}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Weather Details -->
        <div class="grid grid-cols-2 gap-4">
          <div class="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
            <div class="flex items-center space-x-2">
              <span class="text-blue-500 text-xl animate-pulse">💧</span>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Humidity</div>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {$weatherData.current.humidity}%
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-green-50 dark:bg-green-900/20 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
            <div class="flex items-center space-x-2">
              <span class="text-green-500 text-xl animate-bounce-slow">💨</span>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Wind Speed</div>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {$weatherData.current.windSpeed} km/h
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
            <div class="flex items-center space-x-2">
              <span class="text-purple-500 text-xl {$weatherData.current.precipitation > 0 ? 'animate-bounce' : 'animate-pulse-slow'}">🌧️</span>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Precipitation</div>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {$weatherData.current.precipitation} mm
                </div>
              </div>
            </div>
          </div>
          
          <div class="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4 hover:scale-105 transition-transform duration-200">
            <div class="flex items-center space-x-2">
              <span class="text-orange-500 text-xl animate-pulse">🌡️</span>
              <div>
                <div class="text-sm text-gray-600 dark:text-gray-400">Feels like</div>
                <div class="font-semibold text-gray-900 dark:text-white">
                  {$weatherData.current.temperature}°C
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 7-Day Forecast -->
    <div class="weather-card">
      <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-6">
        7-Day Forecast
      </h3>
      
      <div class="space-y-3">
        {#each $weatherData.daily as day, index}
          <div class="flex items-center justify-between p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200 hover:scale-[1.02]">
            <div class="flex items-center space-x-4">
              <div class="text-2xl {getWeatherIcon(day.weatherCode).animation}">
                {getWeatherIcon(day.weatherCode).icon}
              </div>
              <div>
                <div class="font-medium text-gray-900 dark:text-white">
                  {isToday(day.date) ? 'Today' : formatDate(day.date)}
                </div>
                <div class="text-sm text-gray-600 dark:text-gray-400">
                  {getWeatherDescription(day.weatherCode)}
                </div>
              </div>
            </div>
            
            <div class="flex items-center space-x-6">
              <div class="text-right">
                <div class="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <span class="flex items-center space-x-1">
                    <span class="{day.precipitation > 0 ? 'animate-bounce' : ''}">💧</span>
                    <span>{day.precipitation}mm</span>
                  </span>
                  <span class="flex items-center space-x-1">
                    <span class="animate-pulse-slow">💨</span>
                    <span>{day.windSpeed}km/h</span>
                  </span>
                </div>
              </div>
              <div class="text-right">
                <div class="font-bold text-gray-900 dark:text-white">
                  {day.temperatureMax}°
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {day.temperatureMin}°
                </div>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {:else}
    <div class="weather-card">
      <div class="text-center py-12">
        <div class="text-gray-400 text-6xl mb-4 animate-bounce-slow">🌤️</div>
        <h3 class="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">
          No Weather Data
        </h3>
        <p class="text-gray-600 dark:text-gray-400">
          Please allow location access or search for a city to see weather information.
        </p>
      </div>
    </div>
  {/if}
</div> 