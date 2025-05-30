import { weatherStatesData, type WeatherStateTransition } from './weatherStatesData';
import type { WeatherData } from '../stores/weather';

export interface WeatherState {
  name: string;
  description: string;
  confidence: number;
}

export interface WeatherTransition {
  from: string;
  to: string;
  probability: number;
  description: string;
  clothing: string;
  forecast_strings: string[];
  fitness_suggestions: string;
  meal_suggestions: string;
  activity_suggestions: string;
}

export interface TransitionForecast {
  currentState: WeatherState;
  transitions: WeatherTransition[];
  timeframe: string;
}

// Map Open-Meteo weather codes to our weather states
export function mapWeatherCodeToState(
  weatherCode: number,
  temperature: number,
  humidity: number,
  windSpeed: number,
  precipitation: number,
  precipitationProbability: number
): WeatherState {
  let stateName = 'Mild';
  let confidence = 0.8;

  // Temperature-based primary classification
  if (temperature > 35) {
    stateName = 'Heatwave';
    confidence = 0.9;
  } else if (temperature > 25) {
    stateName = 'Hot_Sunny';
    confidence = 0.8;
  } else if (temperature < 0) {
    stateName = 'Freezing';
    confidence = 0.9;
  } else if (temperature < 10) {
    stateName = 'Cold';
    confidence = 0.8;
  } else if (temperature >= 10 && temperature <= 20) {
    stateName = 'Mild';
    confidence = 0.7;
  } else if (temperature > 20 && temperature <= 25) {
    stateName = 'Sunny';
    confidence = 0.7;
  }

  // Weather code modifiers
  switch (weatherCode) {
    case 0: // Clear sky
      if (temperature > 25) stateName = 'Hot_Sunny';
      else if (temperature >= 15) stateName = 'Sunny';
      else stateName = 'Mild';
      confidence = 0.9;
      break;

    case 1: case 2: // Mainly clear, partly cloudy
      if (temperature > 25) stateName = 'Hot_Sunny';
      else if (temperature >= 15) stateName = 'Sunny';
      else stateName = 'Mild';
      confidence = 0.8;
      break;

    case 3: // Overcast
      stateName = 'Cloudy';
      confidence = 0.9;
      break;

    case 45: case 48: // Fog
      stateName = 'Foggy';
      confidence = 0.9;
      break;

    case 51: case 53: case 55: // Drizzle
    case 56: case 57: // Freezing drizzle
    case 80: case 81: // Rain showers
      stateName = 'Showery';
      confidence = 0.8;
      break;

    case 61: case 63: case 65: // Rain
    case 66: case 67: // Freezing rain
    case 82: // Violent rain showers
      stateName = 'Rainy';
      confidence = 0.9;
      break;

    case 71: case 73: case 75: case 77: // Snow
    case 85: case 86: // Snow showers
      stateName = 'Snowy';
      confidence = 0.9;
      break;

    case 95: case 96: case 99: // Thunderstorm
      stateName = 'Stormy';
      confidence = 0.9;
      break;
  }

  // Wind speed modifiers
  if (windSpeed > 20 && stateName !== 'Stormy') {
    stateName = 'Windy';
    confidence = Math.max(0.7, confidence - 0.1);
  }

  // Humidity modifiers
  if (humidity > 80 && temperature > 20 && !['Rainy', 'Showery', 'Stormy'].includes(stateName)) {
    stateName = 'Humid';
    confidence = Math.max(0.6, confidence - 0.2);
  }

  // Dry conditions
  if (humidity < 30 && precipitation === 0 && precipitationProbability < 10) {
    stateName = 'Dry';
    confidence = Math.max(0.7, confidence - 0.1);
  }

  const state = weatherStatesData.weather_states[stateName];
  return {
    name: stateName,
    description: state?.description || 'Unknown weather condition',
    confidence
  };
}

// Calculate transition probabilities
export function calculateTransitionProbabilities(
  currentState: WeatherState,
  weatherData: WeatherData,
  timeframe: 'hourly' | 'daily' = 'daily'
): WeatherTransition[] {
  const stateData = weatherStatesData.weather_states[currentState.name];
  if (!stateData?.transitions) return [];

  const transitions: WeatherTransition[] = [];
  const baseTime = timeframe === 'hourly' ? 6 : 24; // 6 hours or 24 hours ahead

  // Get future weather data
  const futureData = timeframe === 'hourly' 
    ? weatherData.hourly.slice(0, baseTime)
    : weatherData.daily.slice(0, Math.min(7, weatherData.daily.length));

  stateData.transitions.forEach((transition: WeatherStateTransition) => {
    // Base probability from YAML likelihood
    let baseProbability = 0;
    switch (transition.likelihood) {
      case 'Common': baseProbability = 0.6; break;
      case 'Plausible': baseProbability = 0.3; break;
      case 'Less_Likely': baseProbability = 0.1; break;
      default: baseProbability = 0.2; break;
    }

    // Adjust probability based on actual forecast data
    let adjustedProbability = baseProbability;

    if (futureData.length > 0) {
      const futureWeather = futureData[Math.min(3, futureData.length - 1)]; // Look 3-6 hours or 3 days ahead
      
      if (timeframe === 'hourly') {
        const hourlyData = futureWeather as any;
        adjustedProbability *= (1 + (hourlyData.precipitationProbability || 0) / 100);
      } else {
        const dailyData = futureWeather as any;
        // Use precipitation sum and weather code to adjust probability
        if (dailyData.precipitationSum > 0) {
          adjustedProbability *= 1.2;
        }
      }
    }

    // Normalize probability to stay within 0-1 range
    adjustedProbability = Math.min(1, Math.max(0, adjustedProbability));

    transitions.push({
      from: currentState.name,
      to: transition.to,
      probability: adjustedProbability,
      description: transition.description,
      clothing: transition.clothing,
      forecast_strings: transition.forecast_strings || [],
      fitness_suggestions: transition.fitness_suggestions || '',
      meal_suggestions: transition.meal_suggestions || '',
      activity_suggestions: transition.activity_suggestions || ''
    });
  });

  // Sort by probability (highest first)
  return transitions.sort((a, b) => b.probability - a.probability);
}

// Generate transition forecast
export function generateTransitionForecast(
  weatherData: WeatherData,
  timeframe: 'hourly' | 'daily' = 'daily'
): TransitionForecast {
  const currentWeather = weatherData.current;
  
  const currentState = mapWeatherCodeToState(
    currentWeather.weatherCode,
    currentWeather.temperature,
    currentWeather.humidity,
    currentWeather.windSpeed,
    currentWeather.precipitation,
    currentWeather.precipitationProbability
  );

  const transitions = calculateTransitionProbabilities(currentState, weatherData, timeframe);

  return {
    currentState,
    transitions,
    timeframe: timeframe === 'hourly' ? 'Next 6 hours' : 'Next 7 days'
  };
}

// Get weather state emoji
export function getWeatherStateEmoji(stateName: string): string {
  const emojiMap: Record<string, string> = {
    'Heatwave': '🔥',
    'Hot_Sunny': '☀️',
    'Sunny': '🌞',
    'Mild': '🌤️',
    'Cloudy': '☁️',
    'Showery': '🌦️',
    'Rainy': '🌧️',
    'Stormy': '⛈️',
    'Windy': '💨',
    'Foggy': '🌫️',
    'Cold': '🥶',
    'Freezing': '🧊',
    'Snowy': '❄️',
    'Humid': '💧',
    'Dry': '🏜️'
  };
  return emojiMap[stateName] || '🌡️';
}

// Format probability as percentage
export function formatProbability(probability: number): string {
  return `${Math.round(probability * 100)}%`;
}

// Get transition color for UI
export function getTransitionColor(probability: number): string {
  if (probability >= 0.6) return 'text-green-600 dark:text-green-400';
  if (probability >= 0.3) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
} 