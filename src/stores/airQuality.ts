import { writable } from 'svelte/store';

export interface AirQualityCurrent {
  european_aqi: number;
  us_aqi: number;
  pm10: number;
  pm2_5: number;
  no2: number;
  o3: number;
  uv_index: number;
}

export interface AirQualityState {
  data: AirQualityCurrent | null;
  loading: boolean;
  error: string | null;
}

const initialState: AirQualityState = {
  data: null,
  loading: false,
  error: null,
};

export const airQualityStore = writable<AirQualityState>(initialState);

const AIR_QUALITY_CACHE_KEY = 'weatherwise-air-quality-cache';

function saveAirQualityCache(data: AirQualityCurrent) {
  try {
    localStorage.setItem(
      AIR_QUALITY_CACHE_KEY,
      JSON.stringify({ data, timestamp: Date.now() })
    );
  } catch {}
}

export function loadAirQualityCache(): AirQualityCurrent | null {
  try {
    const raw = localStorage.getItem(AIR_QUALITY_CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (typeof parsed === 'object' && parsed.data) {
      return parsed.data;
    }
    return null;
  } catch {
    return null;
  }
}

export async function fetchAirQuality(latitude: number, longitude: number): Promise<void> {
  airQualityStore.update((state) => ({ ...state, loading: true, error: null }));

  try {
    const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,no2,o3,uv_index&timezone=auto`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Air Quality API error: ${response.status}`);
    }
    const data = await response.json();
    if (!data.current) {
      throw new Error('Invalid air quality data received');
    }
    const aq: AirQualityCurrent = {
      european_aqi: data.current.european_aqi,
      us_aqi: data.current.us_aqi,
      pm10: data.current.pm10,
      pm2_5: data.current.pm2_5,
      no2: data.current.no2,
      o3: data.current.o3,
      uv_index: data.current.uv_index,
    };
    saveAirQualityCache(aq);
    airQualityStore.set({ data: aq, loading: false, error: null });
  } catch (error) {
    const cached = loadAirQualityCache();
    if (cached) {
      airQualityStore.set({ data: cached, loading: false, error: null });
    } else {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch air quality data';
      airQualityStore.set({ data: null, loading: false, error: errorMessage });
    }
  }
} 