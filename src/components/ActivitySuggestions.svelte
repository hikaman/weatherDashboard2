<script lang="ts">
  import { weatherData } from '../stores/weather';
  
  interface ActivityItem {
    name: string;
    icon: string;
    description: string;
    type: 'outdoor' | 'indoor' | 'mixed';
    intensity: 'low' | 'moderate' | 'high';
    duration: string;
    suitability: 'excellent' | 'good' | 'fair' | 'poor';
    conditions: string;
  }
  
  interface ActivitySuggestions {
    general: ActivityItem[];
    kids: ActivityItem[];
  }
  
  $: suggestions = generateActivitySuggestions($weatherData);
  
  function generateActivitySuggestions(weather: any): ActivitySuggestions {
    if (!weather) return { general: [], kids: [] };
    
    const generalActivities: ActivityItem[] = [];
    const kidsActivities: ActivityItem[] = [];
    
    const temp = weather.current.temperature;
    const apparentTemp = weather.current.apparentTemperature;
    const precipitation = weather.current.precipitation;
    const precipitationProb = weather.current.precipitationProbability;
    const windSpeed = weather.current.windSpeed;
    const uvIndex = weather.current.uvIndex;
    const cloudCover = weather.current.cloudCover;
    const pm25 = weather.hourly?.[0]?.pm25;
    const visibility = weather.current.visibility;
    
    // Determine weather conditions
    const isSunny = cloudCover < 30 && precipitationProb < 20;
    const isCloudy = cloudCover > 50;
    const isRainy = precipitation > 0 || precipitationProb > 50;
    const isWindy = windSpeed > 20;
    const isVeryWindy = windSpeed > 40;
    const isHot = apparentTemp > 30;
    const isCold = apparentTemp < 5;
    const isPleasant = apparentTemp >= 15 && apparentTemp <= 25;
    const isPoorAirQuality = pm25 && pm25 > 35;
    const isHighUV = uvIndex >= 6;
    const isPoorVisibility = visibility < 5000;
    
    // Historical context for activity suggestions
    const historicalTemp = weather.historical?.monthlyAverages?.[0]?.temperatureMaxAvg;
    const isWarmerThanUsual = historicalTemp && temp > historicalTemp + 2;
    const isCoolerThanUsual = historicalTemp && temp < historicalTemp - 2;
    
    // OUTDOOR ACTIVITIES
    if (!isRainy && !isPoorAirQuality && !isVeryWindy) {
      // Hiking and Walking
      if (isPleasant && !isHighUV) {
        generalActivities.push({
          name: 'Hiking',
          icon: '🥾',
          description: 'Perfect weather for trail exploration',
          type: 'outdoor',
          intensity: 'moderate',
          duration: '2-4 hours',
          suitability: 'excellent',
          conditions: `${apparentTemp}°C, ${cloudCover}% clouds`
        });
        
        kidsActivities.push({
          name: 'Nature Walk',
          icon: '🌲',
          description: 'Explore nature and collect leaves',
          type: 'outdoor',
          intensity: 'low',
          duration: '1-2 hours',
          suitability: 'excellent',
          conditions: `Perfect for little explorers`
        });
      } else if (temp > 5 && !isHot) {
        generalActivities.push({
          name: 'Brisk Walking',
          icon: '🚶‍♂️',
          description: 'Good conditions for outdoor exercise',
          type: 'outdoor',
          intensity: 'low',
          duration: '30-60 minutes',
          suitability: 'good',
          conditions: `${apparentTemp}°C, manageable conditions`
        });
      }
      
      // Cycling
      if (isPleasant && !isWindy) {
        generalActivities.push({
          name: 'Cycling',
          icon: '🚴‍♂️',
          description: 'Great weather for bike rides',
          type: 'outdoor',
          intensity: 'moderate',
          duration: '1-3 hours',
          suitability: 'excellent',
          conditions: `${apparentTemp}°C, ${windSpeed}km/h wind`
        });
        
        kidsActivities.push({
          name: 'Family Bike Ride',
          icon: '🚴‍♀️',
          description: 'Safe cycling weather for families',
          type: 'outdoor',
          intensity: 'low',
          duration: '30-90 minutes',
          suitability: 'excellent',
          conditions: `Calm winds, good visibility`
        });
      }
      
      // Picnics and Outdoor Dining
      if (isSunny && isPleasant && !isWindy) {
        generalActivities.push({
          name: 'Picnic',
          icon: '🧺',
          description: 'Perfect picnic weather',
          type: 'outdoor',
          intensity: 'low',
          duration: '2-4 hours',
          suitability: 'excellent',
          conditions: `${apparentTemp}°C, sunny skies`
        });
        
        kidsActivities.push({
          name: 'Park Playtime',
          icon: '🛝',
          description: 'Ideal for playground activities',
          type: 'outdoor',
          intensity: 'moderate',
          duration: '1-3 hours',
          suitability: 'excellent',
          conditions: `Safe play conditions`
        });
      }
      
      // Sports Activities
      if (temp > 10 && temp < 28 && !isWindy) {
        generalActivities.push({
          name: 'Outdoor Sports',
          icon: '⚽',
          description: 'Good conditions for team sports',
          type: 'outdoor',
          intensity: 'high',
          duration: '1-2 hours',
          suitability: 'good',
          conditions: `${apparentTemp}°C, suitable for activity`
        });
        
        if (!isHighUV) {
          kidsActivities.push({
            name: 'Soccer/Football',
            icon: '⚽',
            description: 'Great weather for ball games',
            type: 'outdoor',
            intensity: 'moderate',
            duration: '30-90 minutes',
            suitability: 'good',
            conditions: `Safe UV levels for play`
          });
        }
      }
      
      // Water Activities (if hot)
      if (isHot && isSunny) {
        generalActivities.push({
          name: 'Swimming',
          icon: '🏊‍♂️',
          description: 'Perfect weather to cool off',
          type: 'outdoor',
          intensity: 'moderate',
          duration: '1-2 hours',
          suitability: 'excellent',
          conditions: `${apparentTemp}°C, hot and sunny`
        });
        
        kidsActivities.push({
          name: 'Water Play',
          icon: '💦',
          description: 'Sprinklers, water balloons, pool time',
          type: 'outdoor',
          intensity: 'moderate',
          duration: '1-3 hours',
          suitability: 'excellent',
          conditions: `Perfect for cooling off`
        });
      }
      
      // Photography
      if ((isSunny || isCloudy) && !isPoorVisibility) {
        generalActivities.push({
          name: 'Photography',
          icon: '📸',
          description: isSunny ? 'Great lighting for photos' : 'Interesting cloud formations',
          type: 'outdoor',
          intensity: 'low',
          duration: '1-3 hours',
          suitability: 'good',
          conditions: `${visibility/1000}km visibility`
        });
      }
      
      // Gardening
      if (temp > 5 && temp < 30 && !isWindy) {
        generalActivities.push({
          name: 'Gardening',
          icon: '🌱',
          description: 'Good conditions for outdoor work',
          type: 'outdoor',
          intensity: 'moderate',
          duration: '1-2 hours',
          suitability: 'good',
          conditions: `${apparentTemp}°C, manageable conditions`
        });
        
        kidsActivities.push({
          name: 'Garden Exploration',
          icon: '🌻',
          description: 'Plant seeds or explore garden life',
          type: 'outdoor',
          intensity: 'low',
          duration: '30-60 minutes',
          suitability: 'good',
          conditions: `Great for learning about nature`
        });
      }
    }
    
    // RAINY DAY ACTIVITIES
    if (isRainy) {
      generalActivities.push({
        name: 'Museum Visit',
        icon: '🏛️',
        description: 'Perfect indoor cultural activity',
        type: 'indoor',
        intensity: 'low',
        duration: '2-4 hours',
        suitability: 'excellent',
        conditions: `${precipitationProb}% rain chance`
      });
      
      generalActivities.push({
        name: 'Indoor Rock Climbing',
        icon: '🧗‍♂️',
        description: 'Stay active despite the weather',
        type: 'indoor',
        intensity: 'high',
        duration: '1-2 hours',
        suitability: 'excellent',
        conditions: 'Weather-independent activity'
      });
      
      generalActivities.push({
        name: 'Coffee Shop Reading',
        icon: '☕',
        description: 'Cozy indoor atmosphere',
        type: 'indoor',
        intensity: 'low',
        duration: '1-3 hours',
        suitability: 'excellent',
        conditions: 'Perfect rainy day activity'
      });
      
      kidsActivities.push({
        name: 'Indoor Crafts',
        icon: '🎨',
        description: 'Creative projects and art time',
        type: 'indoor',
        intensity: 'low',
        duration: '1-2 hours',
        suitability: 'excellent',
        conditions: 'Great for creativity'
      });
      
      kidsActivities.push({
        name: 'Science Experiments',
        icon: '🔬',
        description: 'Fun learning activities at home',
        type: 'indoor',
        intensity: 'low',
        duration: '30-90 minutes',
        suitability: 'excellent',
        conditions: 'Educational and entertaining'
      });
      
      kidsActivities.push({
        name: 'Story Time',
        icon: '📚',
        description: 'Reading and storytelling session',
        type: 'indoor',
        intensity: 'low',
        duration: '30-60 minutes',
        suitability: 'excellent',
        conditions: 'Calm indoor activity'
      });
      
      // If light rain, some outdoor activities are still possible
      if (precipitation < 2 && temp > 10) {
        kidsActivities.push({
          name: 'Puddle Jumping',
          icon: '🌧️',
          description: 'Fun in light rain with proper gear',
          type: 'outdoor',
          intensity: 'moderate',
          duration: '15-30 minutes',
          suitability: 'good',
          conditions: 'Light rain, proper rain gear needed'
        });
      }
    }
    
    // WINDY CONDITIONS
    if (isWindy && !isVeryWindy && !isRainy) {
      generalActivities.push({
        name: 'Kite Flying',
        icon: '🪁',
        description: `Perfect wind conditions (${windSpeed}km/h)`,
        type: 'outdoor',
        intensity: 'low',
        duration: '30-90 minutes',
        suitability: 'excellent',
        conditions: `${windSpeed}km/h winds`
      });
      
      kidsActivities.push({
        name: 'Kite Flying',
        icon: '🪁',
        description: 'Great wind for colorful kites',
        type: 'outdoor',
        intensity: 'low',
        duration: '30-60 minutes',
        suitability: 'excellent',
        conditions: `Perfect wind speed for kids`
      });
    }
    
    // VERY WINDY CONDITIONS
    if (isVeryWindy) {
      generalActivities.push({
        name: 'Indoor Gym Workout',
        icon: '🏋️‍♂️',
        description: 'Avoid outdoor activities in strong winds',
        type: 'indoor',
        intensity: 'high',
        duration: '45-90 minutes',
        suitability: 'excellent',
        conditions: `${windSpeed}km/h winds - stay indoors`
      });
      
      kidsActivities.push({
        name: 'Indoor Play Area',
        icon: '🎪',
        description: 'Safe indoor play spaces',
        type: 'indoor',
        intensity: 'moderate',
        duration: '1-2 hours',
        suitability: 'excellent',
        conditions: 'Too windy for outdoor play'
      });
    }
    
    // POOR AIR QUALITY
    if (isPoorAirQuality) {
      generalActivities.push({
        name: 'Indoor Yoga',
        icon: '🧘‍♀️',
        description: 'Gentle exercise with clean indoor air',
        type: 'indoor',
        intensity: 'low',
        duration: '30-60 minutes',
        suitability: 'excellent',
        conditions: `PM2.5: ${pm25}μg/m³ - avoid outdoor exercise`
      });
      
      generalActivities.push({
        name: 'Shopping Mall Walk',
        icon: '🛍️',
        description: 'Indoor walking in filtered air',
        type: 'indoor',
        intensity: 'low',
        duration: '30-90 minutes',
        suitability: 'good',
        conditions: 'Air-conditioned environment'
      });
      
      kidsActivities.push({
        name: 'Indoor Playground',
        icon: '🎠',
        description: 'Safe play away from air pollution',
        type: 'indoor',
        intensity: 'moderate',
        duration: '1-2 hours',
        suitability: 'excellent',
        conditions: 'Clean indoor air essential for kids'
      });
    }
    
    // HIGH UV CONDITIONS
    if (isHighUV && !isRainy) {
      generalActivities.push({
        name: 'Early Morning Hike',
        icon: '🌅',
        description: 'Avoid peak UV hours (10am-4pm)',
        type: 'outdoor',
        intensity: 'moderate',
        duration: '1-2 hours',
        suitability: 'good',
        conditions: `UV Index ${uvIndex} - early/late day recommended`
      });
      
      kidsActivities.push({
        name: 'Shaded Playground',
        icon: '🌳',
        description: 'Play areas with good shade coverage',
        type: 'outdoor',
        intensity: 'moderate',
        duration: '30-60 minutes',
        suitability: 'fair',
        conditions: `UV Index ${uvIndex} - shade essential`
      });
    }
    
    // COLD WEATHER ACTIVITIES
    if (isCold && !isRainy) {
      generalActivities.push({
        name: 'Winter Sports',
        icon: '⛷️',
        description: 'Great conditions for winter activities',
        type: 'outdoor',
        intensity: 'high',
        duration: '2-4 hours',
        suitability: 'good',
        conditions: `${apparentTemp}°C - dress warmly`
      });
      
      generalActivities.push({
        name: 'Hot Beverage Tour',
        icon: '☕',
        description: 'Warm up at cozy cafes',
        type: 'mixed',
        intensity: 'low',
        duration: '2-3 hours',
        suitability: 'excellent',
        conditions: 'Perfect for warming up'
      });
      
      kidsActivities.push({
        name: 'Snow Play',
        icon: '⛄',
        description: 'Snowman building and snow angels',
        type: 'outdoor',
        intensity: 'moderate',
        duration: '30-60 minutes',
        suitability: 'good',
        conditions: `${apparentTemp}°C - limit exposure time`
      });
    }
    
    // ALWAYS AVAILABLE INDOOR ACTIVITIES
    generalActivities.push({
      name: 'Board Games',
      icon: '🎲',
      description: 'Weather-independent social activity',
      type: 'indoor',
      intensity: 'low',
      duration: '1-3 hours',
      suitability: 'excellent',
      conditions: 'Any weather'
    });
    
    kidsActivities.push({
      name: 'Building Blocks',
      icon: '🧱',
      description: 'Creative construction play',
      type: 'indoor',
      intensity: 'low',
      duration: '30-90 minutes',
      suitability: 'excellent',
      conditions: 'Perfect anytime activity'
    });
    
    // Sort by suitability and type
    const sortedGeneral = generalActivities.sort((a, b) => {
      const suitabilityOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
      return suitabilityOrder[b.suitability] - suitabilityOrder[a.suitability];
    });
    
    const sortedKids = kidsActivities.sort((a, b) => {
      const suitabilityOrder = { excellent: 4, good: 3, fair: 2, poor: 1 };
      return suitabilityOrder[b.suitability] - suitabilityOrder[a.suitability];
    });
    
    return {
      general: sortedGeneral.slice(0, 8), // Limit to top 8 suggestions
      kids: sortedKids.slice(0, 8)
    };
  }
  
  function getSuitabilityColor(suitability: string): string {
    switch (suitability) {
      case 'excellent': return 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20';
      case 'good': return 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20';
      case 'fair': return 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20';
      case 'poor': return 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20';
      default: return 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/20';
    }
  }
  
  function getSuitabilityBadge(suitability: string): string {
    switch (suitability) {
      case 'excellent': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'good': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'fair': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'poor': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
  
  function getTypeColor(type: string): string {
    switch (type) {
      case 'outdoor': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      case 'indoor': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200';
      case 'mixed': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
  
  function getIntensityColor(intensity: string): string {
    switch (intensity) {
      case 'high': return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-200';
      case 'moderate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/50 dark:text-gray-200';
    }
  }
  
  let selectedTab: 'general' | 'kids' = 'general';
</script>

<div class="suggestion-card">
  <div class="flex items-center justify-between mb-4">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-2">🎯</span>
      Activity Suggestions
    </h3>
    {#if suggestions.general.length > 0 || suggestions.kids.length > 0}
      <span class="text-sm text-gray-500 dark:text-gray-400">
        Weather-optimized
      </span>
    {/if}
  </div>
  
  <!-- Tab Navigation -->
  <div class="flex space-x-1 mb-4 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
    <button
      class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 {selectedTab === 'general' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
      on:click={() => selectedTab = 'general'}
    >
      🎯 General ({suggestions.general.length})
    </button>
    <button
      class="flex-1 py-2 px-4 text-sm font-medium rounded-md transition-colors duration-200 {selectedTab === 'kids' ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}"
      on:click={() => selectedTab = 'kids'}
    >
      👶 With Kids ({suggestions.kids.length})
    </button>
  </div>
  
  {#if (selectedTab === 'general' && suggestions.general.length === 0) || (selectedTab === 'kids' && suggestions.kids.length === 0)}
    <div class="text-center py-8">
      <div class="text-gray-400 text-4xl mb-2">🎯</div>
      <p class="text-gray-600 dark:text-gray-400">
        No activity suggestions available for {selectedTab === 'general' ? 'general activities' : 'activities with kids'}
      </p>
    </div>
  {:else}
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {#each selectedTab === 'general' ? suggestions.general : suggestions.kids as activity}
        <div class="border rounded-lg p-4 transition-all duration-200 hover:shadow-md {getSuitabilityColor(activity.suitability)}">
          <div class="flex items-start justify-between mb-3">
            <div class="flex items-center space-x-3">
              <span class="text-3xl">{activity.icon}</span>
              <div>
                <h4 class="font-semibold text-gray-900 dark:text-white">
                  {activity.name}
                </h4>
                <p class="text-sm text-gray-600 dark:text-gray-400">
                  {activity.description}
                </p>
              </div>
            </div>
            <span class="px-2 py-1 text-xs font-medium rounded-full {getSuitabilityBadge(activity.suitability)}">
              {activity.suitability}
            </span>
          </div>
          
          <div class="space-y-2 mb-3">
            <div class="flex items-center justify-between text-sm">
              <span class="text-gray-600 dark:text-gray-400">Duration:</span>
              <span class="font-medium text-gray-900 dark:text-white">{activity.duration}</span>
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {activity.conditions}
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2">
            <span class="px-2 py-1 text-xs font-medium rounded-full {getTypeColor(activity.type)}">
              {activity.type}
            </span>
            <span class="px-2 py-1 text-xs font-medium rounded-full {getIntensityColor(activity.intensity)}">
              {activity.intensity} intensity
            </span>
          </div>
        </div>
      {/each}
    </div>
    
    <!-- Enhanced Weather Context -->
    {#if $weatherData}
      <div class="mt-4 p-3 bg-gray-100 dark:bg-gray-700/50 rounded-lg">
        <p class="text-sm text-gray-600 dark:text-gray-400">
          <span class="font-medium">Weather conditions:</span>
          {$weatherData.current.temperature}°C (feels like {$weatherData.current.apparentTemperature}°C), 
          {$weatherData.current.cloudCover}% clouds, 
          {$weatherData.current.windSpeed}km/h wind, 
          UV Index {$weatherData.current.uvIndex}
          {#if $weatherData.current.precipitationProbability > 0}
            , {$weatherData.current.precipitationProbability}% rain chance
          {/if}
          {#if $weatherData.hourly?.[0]?.pm25}
            , Air Quality: {$weatherData.hourly[0].pm25}μg/m³ PM2.5
          {/if}
        </p>
        {#if $weatherData.historical?.monthlyAverages?.[0]}
          <p class="text-xs text-gray-500 dark:text-gray-500 mt-1">
            Historical average: {$weatherData.historical.monthlyAverages[0].temperatureMaxAvg}°C max
            {#if $weatherData.current.temperature > $weatherData.historical.monthlyAverages[0].temperatureMaxAvg + 2}
              (warmer than usual)
            {:else if $weatherData.current.temperature < $weatherData.historical.monthlyAverages[0].temperatureMaxAvg - 2}
              (cooler than usual)
            {/if}
          </p>
        {/if}
      </div>
    {/if}
  {/if}
</div> 