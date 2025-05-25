import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Enhanced interfaces based on the comprehensive guide
export interface WeatherData {
  location: {
    name: string;
    latitude: number;
    longitude: number;
    timezone: string;
    city: string;
  };
  current: {
    time: string;
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    windSpeed: number;
    windDirection: number;
    precipitation: number;
    precipitationProbability: number;
    weatherCode: number;
    cloudCover: number;
    visibility: number;
    uvIndex: number;
    isDay: boolean;
  };
  hourly: Array<{
    time: string;
    temperature: number;
    apparentTemperature: number;
    humidity: number;
    dewpoint: number;
    precipitationProbability: number;
    precipitation: number;
    rain: number;
    showers: number;
    snowfall: number;
    cloudCover: number;
    visibility: number;
    windSpeed: number;
    windDirection: number;
    uvIndex: number;
    isDay: boolean;
    pm25?: number;
    pm10?: number;
    carbonMonoxide?: number;
    ozone?: number;
  }>;
  daily: Array<{
    date: string;
    temperatureMax: number;
    temperatureMin: number;
    apparentTemperatureMax: number;
    apparentTemperatureMin: number;
    sunrise: string;
    sunset: string;
    uvIndexMax: number;
    precipitationSum: number;
    rainSum: number;
    showersSum: number;
    snowfallSum: number;
    precipitationHours: number;
    windSpeedMax: number;
    weatherCode: number;
  }>;
  historical?: {
    monthlyAverages: Array<{
      month: string;
      temperatureMaxAvg: number;
      temperatureMinAvg: number;
      precipitationSumAvg: number;
    }>;
  };
  climate?: {
    projections: Array<{
      year: number;
      temperatureMaxAvg: number;
      temperatureMinAvg: number;
      precipitationSumAvg: number;
    }>;
  };
  airQuality?: {
    hourly: Array<{
      time: string;
      pm25: number;
      pm10: number;
      carbonMonoxide: number;
      ozone: number;
      uvIndex: number;
    }>;
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

// Cache management functions
function cacheData(key: string, data: any, ttlHours: number = 1) {
  if (!browser) return;
  
  try {
    const now = new Date();
    const expiry = now.getTime() + (ttlHours * 60 * 60 * 1000);
    localStorage.setItem(key, JSON.stringify({ data, expiry }));
  } catch (error) {
    console.error('Error caching data:', error);
  }
}

function getCachedData(key: string): any | null {
  if (!browser) return null;
  
  try {
    const item = localStorage.getItem(key);
    if (!item) return null;
    
    const { data, expiry } = JSON.parse(item);
    if (new Date().getTime() > expiry) {
      localStorage.removeItem(key);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Error getting cached data:', error);
    return null;
  }
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

// Merge hourly data from different APIs
function mergeHourlyData(weatherHourly: any, airQualityHourly?: any): any[] {
  return weatherHourly.time.map((time: string, i: number) => ({
    time,
    temperature: weatherHourly.temperature_2m[i],
    apparentTemperature: weatherHourly.apparent_temperature[i],
    humidity: weatherHourly.relative_humidity_2m[i],
    dewpoint: weatherHourly.dewpoint_2m[i],
    precipitationProbability: weatherHourly.precipitation_probability[i],
    precipitation: weatherHourly.precipitation[i],
    rain: weatherHourly.rain[i],
    showers: weatherHourly.showers[i],
    snowfall: weatherHourly.snowfall[i],
    cloudCover: weatherHourly.cloud_cover[i],
    visibility: weatherHourly.visibility[i],
    windSpeed: weatherHourly.wind_speed_10m[i],
    windDirection: weatherHourly.wind_direction_10m[i],
    uvIndex: weatherHourly.uv_index[i],
    isDay: weatherHourly.is_day[i] === 1,
    // Air quality data if available
    pm25: airQualityHourly?.pm2_5?.[i],
    pm10: airQualityHourly?.pm10?.[i],
    carbonMonoxide: airQualityHourly?.carbon_monoxide?.[i],
    ozone: airQualityHourly?.ozone?.[i]
  }));
}

// Fetch comprehensive weather data using multiple APIs
export async function fetchWeatherData(latitude: number, longitude: number, locationName: string = '') {
  weatherLoading.set(true);
  weatherError.set(null);
  
  try {
    // Check for cached data first
    const cacheKey = `weather_${latitude}_${longitude}`;
    const cachedData = getCachedData(cacheKey);
    if (cachedData) {
      weatherData.set(cachedData);
      weatherLoading.set(false);
      return;
    }

    // Comprehensive forecast API call
    const forecastUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,precipitation_probability,weather_code,cloud_cover,wind_speed_10m,wind_direction_10m,uv_index,is_day&hourly=temperature_2m,relative_humidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,rain,showers,snowfall,cloud_cover,visibility,wind_speed_10m,wind_direction_10m,uv_index,is_day&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,uv_index_max,precipitation_sum,rain_sum,showers_sum,snowfall_sum,precipitation_hours,wind_speed_10m_max&timezone=auto&past_days=7&forecast_days=16`;

    // Air quality API call
    const airQualityUrl = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=pm10,pm2_5,carbon_monoxide,ozone,uv_index&past_days=7&forecast_days=7`;

    // Historical data for context (past 30 days)
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 30);
    const historicalUrl = `https://api.open-meteo.com/v1/archive?latitude=${latitude}&longitude=${longitude}&start_date=${startDate.toISOString().split('T')[0]}&end_date=${endDate.toISOString().split('T')[0]}&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`;

    // Fetch all data concurrently
    const [forecastResponse, airQualityResponse, historicalResponse] = await Promise.allSettled([
      fetch(forecastUrl).then(res => res.ok ? res.json() : null),
      fetch(airQualityUrl).then(res => res.ok ? res.json() : null),
      fetch(historicalUrl).then(res => res.ok ? res.json() : null)
    ]);

    const forecastData = forecastResponse.status === 'fulfilled' ? forecastResponse.value : null;
    const airQualityData = airQualityResponse.status === 'fulfilled' ? airQualityResponse.value : null;
    const historicalData = historicalResponse.status === 'fulfilled' ? historicalResponse.value : null;

    if (!forecastData) {
      throw new Error('Failed to fetch weather data');
    }

    // Process historical data for monthly averages
    let monthlyAverages: Array<{
      month: string;
      temperatureMaxAvg: number;
      temperatureMinAvg: number;
      precipitationSumAvg: number;
    }> = [];
    if (historicalData?.daily) {
      const tempMaxSum = historicalData.daily.temperature_2m_max.reduce((a: number, b: number) => a + b, 0);
      const tempMinSum = historicalData.daily.temperature_2m_min.reduce((a: number, b: number) => a + b, 0);
      const precipSum = historicalData.daily.precipitation_sum.reduce((a: number, b: number) => a + b, 0);
      const days = historicalData.daily.time.length;
      
      monthlyAverages = [{
        month: new Date().toISOString().slice(0, 7),
        temperatureMaxAvg: Math.round(tempMaxSum / days),
        temperatureMinAvg: Math.round(tempMinSum / days),
        precipitationSumAvg: Math.round(precipSum / days * 10) / 10
      }];
    }

    // Merge hourly data
    const mergedHourly = mergeHourlyData(forecastData.hourly, airQualityData?.hourly);

    const weatherInfo: WeatherData = {
      location: {
        name: locationName,
        latitude,
        longitude,
        timezone: forecastData.timezone || 'UTC',
        city: locationName.split(',')[0] || 'Unknown'
      },
      current: {
        time: forecastData.current.time,
        temperature: Math.round(forecastData.current.temperature_2m),
        apparentTemperature: Math.round(forecastData.current.apparent_temperature),
        humidity: forecastData.current.relative_humidity_2m,
        windSpeed: Math.round(forecastData.current.wind_speed_10m),
        windDirection: forecastData.current.wind_direction_10m,
        precipitation: forecastData.current.precipitation,
        precipitationProbability: forecastData.current.precipitation_probability || 0,
        weatherCode: forecastData.current.weather_code,
        cloudCover: forecastData.current.cloud_cover,
        visibility: forecastData.current.visibility || 10000,
        uvIndex: forecastData.current.uv_index,
        isDay: forecastData.current.is_day === 1
      },
      hourly: mergedHourly,
      daily: forecastData.daily.time.map((date: string, index: number) => ({
        date,
        temperatureMax: Math.round(forecastData.daily.temperature_2m_max[index]),
        temperatureMin: Math.round(forecastData.daily.temperature_2m_min[index]),
        apparentTemperatureMax: Math.round(forecastData.daily.apparent_temperature_max[index]),
        apparentTemperatureMin: Math.round(forecastData.daily.apparent_temperature_min[index]),
        sunrise: forecastData.daily.sunrise[index],
        sunset: forecastData.daily.sunset[index],
        uvIndexMax: forecastData.daily.uv_index_max[index],
        precipitationSum: forecastData.daily.precipitation_sum[index],
        rainSum: forecastData.daily.rain_sum[index],
        showersSum: forecastData.daily.showers_sum[index],
        snowfallSum: forecastData.daily.snowfall_sum[index],
        precipitationHours: forecastData.daily.precipitation_hours[index],
        windSpeedMax: Math.round(forecastData.daily.wind_speed_10m_max[index]),
        weatherCode: forecastData.daily.weather_code[index]
      })),
      historical: monthlyAverages.length > 0 ? { monthlyAverages } : undefined,
      airQuality: airQualityData ? {
        hourly: airQualityData.hourly.time.map((time: string, i: number) => ({
          time,
          pm25: airQualityData.hourly.pm2_5[i],
          pm10: airQualityData.hourly.pm10[i],
          carbonMonoxide: airQualityData.hourly.carbon_monoxide[i],
          ozone: airQualityData.hourly.ozone[i],
          uvIndex: airQualityData.hourly.uv_index[i]
        }))
      } : undefined
    };
    
    weatherData.set(weatherInfo);
    
    // Cache the comprehensive data for 1 hour
    cacheData(cacheKey, weatherInfo, 1);
    
    // Save as last searched city if it has a name
    if (locationName) {
      const cityData: LocationData = {
        name: locationName.split(',')[0],
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
    
    // Try to load any cached data as fallback
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

// Load cached weather data (legacy support)
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