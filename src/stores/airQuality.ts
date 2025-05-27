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

  // Helper to set error
  function setError(msg: string) {
    airQualityStore.set({ data: null, loading: false, error: msg });
  }

  try {
    // Try full current data first
    let url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=european_aqi,us_aqi,pm10,pm2_5,no2,o3,uv_index&timezone=auto`;
    let response = await fetch(url);
    let data = await response.json();
    if (response.ok && data.current) {
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
      return;
    }
    // If 400 error, try only uv_index
    if (response.status === 400 || !data.current) {
      url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&current=uv_index&timezone=auto`;
      response = await fetch(url);
      data = await response.json();
      if (response.ok && data.current) {
        const aq: AirQualityCurrent = {
          european_aqi: NaN,
          us_aqi: NaN,
          pm10: NaN,
          pm2_5: NaN,
          no2: NaN,
          o3: NaN,
          uv_index: data.current.uv_index,
        };
        saveAirQualityCache(aq);
        airQualityStore.set({ data: aq, loading: false, error: null });
        return;
      }
    }
    // If still fails, try hourly uv_index as fallback
    url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${latitude}&longitude=${longitude}&hourly=uv_index&timezone=auto`;
    response = await fetch(url);
    data = await response.json();
    if (response.ok && data.hourly && data.hourly.uv_index && data.hourly.uv_index.length > 0) {
      // Use the first hour as 'current'
      const aq: AirQualityCurrent = {
        european_aqi: NaN,
        us_aqi: NaN,
        pm10: NaN,
        pm2_5: NaN,
        no2: NaN,
        o3: NaN,
        uv_index: data.hourly.uv_index[0],
      };
      saveAirQualityCache(aq);
      airQualityStore.set({ data: aq, loading: false, error: 'Only UV index available (hourly forecast)' });
      return;
    }
    // All attempts failed
    const cached = loadAirQualityCache();
    if (cached) {
      airQualityStore.set({ data: cached, loading: false, error: 'Showing cached air quality data.' });
    } else {
      setError('Air quality data is not available for this location.');
    }
  } catch (error) {
    const cached = loadAirQualityCache();
    if (cached) {
      airQualityStore.set({ data: cached, loading: false, error: 'Showing cached air quality data.' });
    } else {
      setError('Failed to fetch air quality data.');
    }
  }
} 