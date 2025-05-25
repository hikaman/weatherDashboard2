import { writable } from 'svelte/store';
import { browser } from '$app/environment';

export interface WeatherData {
  current: {
    temperature: number;
    humidity: number;
    windSpeed: number;
    precipitation: number;
    weatherCode: number;
    time: string;
  };
  daily: Array<{
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    precipitation: number;
    weatherCode: number;
    windSpeed: number;
  }>;
  location: {
    name: string;
    latitude: number;
    longitude: number;
  };
}

export interface LocationData {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  admin1?: string;
}

// Weather store
export const weatherData = writable<WeatherData | null>(null);
export const weatherLoading = writable<boolean>(false);
export const weatherError = writable<string | null>(null);

// Location store
export const currentLocation = writable<LocationData | null>(null);
export const lastSearchedCity = writable<LocationData | null>(null);

// Weather code descriptions
const weatherDescriptions: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Dense freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snow fall',
  73: 'Moderate snow fall',
  75: 'Heavy snow fall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail'
};

export function getWeatherDescription(code: number): string {
  return weatherDescriptions[code] || 'Unknown';
}

// Save last searched city to localStorage
export function saveLastSearchedCity(location: LocationData) {
  if (!browser) return;
  
  try {
    localStorage.setItem('lastSearchedCity', JSON.stringify(location));
    lastSearchedCity.set(location);
  } catch (error) {
    console.error('Error saving last searched city:', error);
  }
}

// Load last searched city from localStorage
export function loadLastSearchedCity(): LocationData | null {
  if (!browser) return null;
  
  try {
    const saved = localStorage.getItem('lastSearchedCity');
    if (saved) {
      const location = JSON.parse(saved);
      lastSearchedCity.set(location);
      return location;
    }
  } catch (error) {
    console.error('Error loading last searched city:', error);
  }
  return null;
}

// Fetch weather data from Open-Meteo API
export async function fetchWeatherData(latitude: number, longitude: number, locationName: string = '') {
  weatherLoading.set(true);
  weatherError.set(null);
  
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,wind_speed_10m_max&timezone=auto`
    );
    
    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    const weatherInfo: WeatherData = {
      current: {
        temperature: Math.round(data.current.temperature_2m),
        humidity: data.current.relative_humidity_2m,
        windSpeed: Math.round(data.current.wind_speed_10m),
        precipitation: data.current.precipitation,
        weatherCode: data.current.weather_code,
        time: data.current.time
      },
      daily: data.daily.time.map((date: string, index: number) => ({
        date,
        temperatureMax: Math.round(data.daily.temperature_2m_max[index]),
        temperatureMin: Math.round(data.daily.temperature_2m_min[index]),
        precipitation: data.daily.precipitation_sum[index],
        weatherCode: data.daily.weather_code[index],
        windSpeed: Math.round(data.daily.wind_speed_10m_max[index])
      })),
      location: {
        name: locationName,
        latitude,
        longitude
      }
    };
    
    weatherData.set(weatherInfo);
    
    // Cache weather data in localStorage
    if (browser) {
      localStorage.setItem('weatherData', JSON.stringify(weatherInfo));
      localStorage.setItem('weatherDataTimestamp', Date.now().toString());
    }
    
    // Save as last searched city if it has a name
    if (locationName) {
      const cityData: LocationData = {
        name: locationName.split(',')[0], // Extract city name
        latitude,
        longitude,
        country: locationName.includes(',') ? locationName.split(',').slice(-1)[0].trim() : '',
        admin1: locationName.split(',').length > 2 ? locationName.split(',')[1].trim() : undefined
      };
      saveLastSearchedCity(cityData);
    }
    
  } catch (error) {
    console.error('Error fetching weather data:', error);
    weatherError.set(error instanceof Error ? error.message : 'Failed to fetch weather data');
    
    // Try to load cached data
    loadCachedWeatherData();
  } finally {
    weatherLoading.set(false);
  }
}

// Search for cities using Open-Meteo Geocoding API
export async function searchCities(query: string): Promise<LocationData[]> {
  if (query.length < 2) return [];
  
  try {
    const response = await fetch(
      `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=5&language=en&format=json`
    );
    
    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status}`);
    }
    
    const data = await response.json();
    
    return data.results?.map((result: any) => ({
      name: result.name,
      latitude: result.latitude,
      longitude: result.longitude,
      country: result.country,
      admin1: result.admin1
    })) || [];
    
  } catch (error) {
    console.error('Error searching cities:', error);
    return [];
  }
}

// Get user's current location
export async function getCurrentLocation(): Promise<LocationData | null> {
  if (!browser) return null;
  
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve(null);
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding to get location name
          const response = await fetch(
            `https://geocoding-api.open-meteo.com/v1/search?latitude=${latitude}&longitude=${longitude}&count=1&language=en&format=json`
          );
          
          if (response.ok) {
            const data = await response.json();
            const result = data.results?.[0];
            
            if (result) {
              const location: LocationData = {
                name: result.name,
                latitude,
                longitude,
                country: result.country,
                admin1: result.admin1
              };
              
              currentLocation.set(location);
              resolve(location);
              return;
            }
          }
        } catch (error) {
          console.error('Error getting location name:', error);
        }
        
        // Fallback if reverse geocoding fails
        const location: LocationData = {
          name: 'Current Location',
          latitude,
          longitude,
          country: ''
        };
        
        currentLocation.set(location);
        resolve(location);
      },
      (error) => {
        console.error('Geolocation error:', error);
        resolve(null);
      },
      {
        timeout: 10000,
        enableHighAccuracy: false
      }
    );
  });
}

// Load cached weather data
function loadCachedWeatherData() {
  if (!browser) return false;
  
  try {
    const cachedData = localStorage.getItem('weatherData');
    const timestamp = localStorage.getItem('weatherDataTimestamp');
    
    if (cachedData && timestamp) {
      const age = Date.now() - parseInt(timestamp);
      // Use cached data if it's less than 1 hour old
      if (age < 60 * 60 * 1000) {
        weatherData.set(JSON.parse(cachedData));
        return true;
      }
    }
  } catch (error) {
    console.error('Error loading cached weather data:', error);
  }
  return false;
}

// Initialize weather data on app start
export function initializeWeather() {
  if (!browser) return;
  
  // Load last searched city
  const lastCity = loadLastSearchedCity();
  
  // Try to load cached data first
  if (!loadCachedWeatherData()) {
    // If no cached data, try last searched city first
    if (lastCity) {
      fetchWeatherData(lastCity.latitude, lastCity.longitude, `${lastCity.name}, ${lastCity.country}`);
    } else {
      // If no last city, try to get current location
      getCurrentLocation().then((location) => {
        if (location) {
          fetchWeatherData(location.latitude, location.longitude, location.name);
        }
      });
    }
  } else {
    // Even if we have cached data, update the last searched city store
    if (lastCity) {
      lastSearchedCity.set(lastCity);
    }
  }
} 