<script lang="ts">
  import { weatherData } from '../stores/weather';
  
  interface ExerciseSuggestion {
    name: string;
    icon: string;
    description: string;
    location: 'indoor' | 'outdoor' | 'both';
    intensity: 'low' | 'medium' | 'high';
    duration: string;
    suitability: 'perfect' | 'good' | 'okay' | 'avoid';
  }
  
  $: suggestions = generateExerciseSuggestions($weatherData);
  
  function generateExerciseSuggestions(weather: any): ExerciseSuggestion[] {
    if (!weather) return [];
    
    const exercises: ExerciseSuggestion[] = [];
    const temp = weather.current.temperature;
    const precipitation = weather.current.precipitation;
    const windSpeed = weather.current.windSpeed;
    const humidity = weather.current.humidity;
    
    // Perfect weather for outdoor activities (15-25°C, no rain)
    if (temp >= 15 && temp <= 25 && precipitation === 0) {
      exercises.push({
        name: 'Jogging',
        icon: '🏃‍♂️',
        description: 'Perfect temperature for outdoor running',
        location: 'outdoor',
        intensity: 'medium',
        duration: '30-45 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Cycling',
        icon: '🚴‍♀️',
        description: 'Ideal conditions for bike rides',
        location: 'outdoor',
        intensity: 'medium',
        duration: '45-60 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Outdoor Yoga',
        icon: '🧘‍♀️',
        description: 'Peaceful outdoor practice',
        location: 'outdoor',
        intensity: 'low',
        duration: '30-60 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Walking',
        icon: '🚶‍♂️',
        description: 'Comfortable weather for walks',
        location: 'outdoor',
        intensity: 'low',
        duration: '20-40 min',
        suitability: 'perfect'
      });
    }
    
    // Hot weather exercises (above 25°C)
    if (temp > 25) {
      exercises.push({
        name: 'Swimming',
        icon: '🏊‍♂️',
        description: 'Perfect for cooling off while exercising',
        location: 'outdoor',
        intensity: 'medium',
        duration: '30-45 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Early Morning Run',
        icon: '🌅',
        description: 'Beat the heat with dawn exercise',
        location: 'outdoor',
        intensity: 'medium',
        duration: '20-30 min',
        suitability: 'good'
      });
      exercises.push({
        name: 'Indoor Gym',
        icon: '🏋️‍♂️',
        description: 'Air-conditioned environment',
        location: 'indoor',
        intensity: 'high',
        duration: '45-60 min',
        suitability: 'good'
      });
      
      if (temp > 30) {
        exercises.push({
          name: 'Light Stretching',
          icon: '🤸‍♀️',
          description: 'Gentle indoor movement',
          location: 'indoor',
          intensity: 'low',
          duration: '15-30 min',
          suitability: 'good'
        });
      }
    }
    
    // Cold weather exercises (below 15°C)
    if (temp < 15) {
      exercises.push({
        name: 'Indoor Yoga',
        icon: '🧘‍♀️',
        description: 'Warm up indoors with yoga',
        location: 'indoor',
        intensity: 'low',
        duration: '30-60 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Home Workout',
        icon: '💪',
        description: 'Bodyweight exercises at home',
        location: 'indoor',
        intensity: 'medium',
        duration: '30-45 min',
        suitability: 'perfect'
      });
      
      if (temp >= 5 && precipitation === 0) {
        exercises.push({
          name: 'Brisk Walk',
          icon: '🚶‍♂️',
          description: 'Bundle up for a quick walk',
          location: 'outdoor',
          intensity: 'low',
          duration: '15-25 min',
          suitability: 'good'
        });
        exercises.push({
          name: 'Winter Running',
          icon: '🏃‍♂️',
          description: 'Dress warmly for cold-weather running',
          location: 'outdoor',
          intensity: 'medium',
          duration: '20-30 min',
          suitability: 'okay'
        });
      }
      
      if (temp <= 0) {
        exercises.push({
          name: 'Indoor Cardio',
          icon: '🏃‍♀️',
          description: 'Stay warm with indoor cardio',
          location: 'indoor',
          intensity: 'high',
          duration: '20-40 min',
          suitability: 'perfect'
        });
      }
    }
    
    // Rainy weather exercises
    if (precipitation > 0) {
      exercises.push({
        name: 'Indoor Yoga',
        icon: '🧘‍♀️',
        description: 'Perfect rainy day activity',
        location: 'indoor',
        intensity: 'low',
        duration: '30-60 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Pilates',
        icon: '🤸‍♀️',
        description: 'Core strengthening indoors',
        location: 'indoor',
        intensity: 'medium',
        duration: '30-45 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Dance Workout',
        icon: '💃',
        description: 'Fun indoor cardio',
        location: 'indoor',
        intensity: 'medium',
        duration: '20-40 min',
        suitability: 'perfect'
      });
      exercises.push({
        name: 'Strength Training',
        icon: '🏋️‍♂️',
        description: 'Perfect gym weather',
        location: 'indoor',
        intensity: 'high',
        duration: '45-60 min',
        suitability: 'good'
      });
      exercises.push({
        name: 'Meditation',
        icon: '🧘‍♂️',
        description: 'Peaceful indoor mindfulness',
        location: 'indoor',
        intensity: 'low',
        duration: '10-30 min',
        suitability: 'good'
      });
    }
    
    // Windy weather considerations
    if (windSpeed > 20) {
      exercises.push({
        name: 'Indoor Activities',
        icon: '🏠',
        description: 'Avoid strong winds outside',
        location: 'indoor',
        intensity: 'medium',
        duration: '30-45 min',
        suitability: 'good'
      });
      
      if (windSpeed > 30) {
        // Mark outdoor activities as less suitable
        exercises.forEach(exercise => {
          if (exercise.location === 'outdoor' && exercise.suitability !== 'avoid') {
            exercise.suitability = 'avoid';
            exercise.description += ' (avoid due to strong winds)';
          }
        });
      }
    }
    
    // High humidity adjustments
    if (humidity > 80) {
      exercises.push({
        name: 'Light Indoor Exercise',
        icon: '🚶‍♀️',
        description: 'Easy on the body in high humidity',
        location: 'indoor',
        intensity: 'low',
        duration: '20-30 min',
        suitability: 'good'
      });
    }
    
    // Always available exercises
    exercises.push({
      name: 'Stretching',
      icon: '🤸‍♀️',
      description: 'Always beneficial, any weather',
      location: 'both',
      intensity: 'low',
      duration: '10-20 min',
      suitability: 'good'
    });
    exercises.push({
      name: 'Bodyweight Exercises',
      icon: '💪',
      description: 'No equipment needed',
      location: 'indoor',
      intensity: 'medium',
      duration: '20-40 min',
      suitability: 'good'
    });
    
    // Remove duplicates and sort by suitability
    const uniqueExercises = exercises.filter((exercise, index, self) => 
      index === self.findIndex(e => e.name === exercise.name)
    );
    
    return uniqueExercises.sort((a, b) => {
      const suitabilityOrder = { perfect: 4, good: 3, okay: 2, avoid: 1 };
      return suitabilityOrder[b.suitability] - suitabilityOrder[a.suitability];
    });
  }
  
  function getSuitabilityColor(suitability: string): string {
    switch (suitability) {
      case 'perfect': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'good': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'okay': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'avoid': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20';
    }
  }
  
  function getSuitabilityBadge(suitability: string): string {
    switch (suitability) {
      case 'perfect': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'okay': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'avoid': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
  
  function getIntensityColor(intensity: string): string {
    switch (intensity) {
      case 'high': return 'text-red-600 dark:text-red-400';
      case 'medium': return 'text-orange-600 dark:text-orange-400';
      case 'low': return 'text-green-600 dark:text-green-400';
      default: return 'text-gray-600 dark:text-gray-400';
    }
  }
  
  function getLocationIcon(location: string): string {
    switch (location) {
      case 'outdoor': return '🌳';
      case 'indoor': return '🏠';
      case 'both': return '🔄';
      default: return '📍';
    }
  }
  
  function getIntensityIcon(intensity: string): string {
    switch (intensity) {
      case 'high': return '🔥';
      case 'medium': return '⚡';
      case 'low': return '🌱';
      default: return '💫';
    }
  }
</script>

<div class="suggestion-card">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-2">💪</span>
      Exercise Suggestions
    </h3>
    {#if suggestions.length > 0}
      <span class="text-sm text-gray-500 dark:text-gray-400">
        {suggestions.length} activities
      </span>
    {/if}
  </div>
  
  {#if suggestions.length === 0}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-2">🏃‍♂️</div>
      <p class="text-gray-600 dark:text-gray-400">
        No exercise suggestions available
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 gap-3">
      {#each suggestions as exercise}
        <div class="border rounded-lg p-4 transition-all duration-200 hover:shadow-md {getSuitabilityColor(exercise.suitability)}">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span class="text-2xl">{exercise.icon}</span>
              <div>
                <h4 class="font-medium text-gray-900 dark:text-white">
                  {exercise.name}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {exercise.description}
                </p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full {getSuitabilityBadge(exercise.suitability)}">
              {exercise.suitability}
            </span>
          </div>
          
          <div class="flex items-center justify-between text-sm">
            <div class="flex items-center space-x-4">
              <span class="flex items-center space-x-1">
                <span>{getLocationIcon(exercise.location)}</span>
                <span class="text-gray-600 dark:text-gray-400 capitalize">{exercise.location}</span>
              </span>
              <span class="flex items-center space-x-1">
                <span class="{getIntensityColor(exercise.intensity)}">{getIntensityIcon(exercise.intensity)}</span>
                <span class="text-gray-600 dark:text-gray-400 capitalize">{exercise.intensity}</span>
              </span>
            </div>
            <div class="flex items-center space-x-1">
              <span class="text-gray-500">⏱️</span>
              <span class="text-gray-600 dark:text-gray-400">{exercise.duration}</span>
            </div>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Legend -->
    <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
      <div class="grid grid-cols-3 gap-4 text-xs text-gray-600 dark:text-gray-400">
        <div>
          <div class="font-medium mb-1">Location:</div>
          <div class="space-y-1">
            <div>🌳 Outdoor</div>
            <div>🏠 Indoor</div>
            <div>🔄 Both</div>
          </div>
        </div>
        <div>
          <div class="font-medium mb-1">Intensity:</div>
          <div class="space-y-1">
            <div><span class="text-green-600">🌱</span> Low</div>
            <div><span class="text-orange-600">⚡</span> Medium</div>
            <div><span class="text-red-600">🔥</span> High</div>
          </div>
        </div>
        <div>
          <div class="font-medium mb-1">Suitability:</div>
          <div class="space-y-1">
            <div><span class="text-green-600">●</span> Perfect</div>
            <div><span class="text-blue-600">●</span> Good</div>
            <div><span class="text-yellow-600">●</span> Okay</div>
            <div><span class="text-red-600">●</span> Avoid</div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Weather Context -->
    {#if $weatherData}
      <div class="mt-2 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium">Weather conditions:</span>
          {$weatherData.current.temperature}°C
          {#if $weatherData.current.precipitation > 0}
            • Rainy ({$weatherData.current.precipitation}mm)
          {:else}
            • Clear skies
          {/if}
          {#if $weatherData.current.windSpeed > 20}
            • Windy ({$weatherData.current.windSpeed}km/h)
          {/if}
          {#if $weatherData.current.humidity > 80}
            • High humidity ({$weatherData.current.humidity}%)
          {/if}
        </p>
      </div>
    {/if}
  {/if}
</div> 