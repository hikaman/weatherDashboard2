import { writable } from 'svelte/store';

export interface LastCity {
  name: string;
  latitude: number;
  longitude: number;
}

const LOCAL_STORAGE_KEY = 'weatherwise-last-city';

function loadLastCity(): LastCity | null {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (
      typeof parsed === 'object' &&
      typeof parsed.name === 'string' &&
      typeof parsed.latitude === 'number' &&
      typeof parsed.longitude === 'number'
    ) {
      return parsed;
    }
    return null;
  } catch {
    return null;
  }
}

function saveLastCity(city: LastCity | null) {
  if (!city) return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(city));
  } catch {}
}

const initial = typeof window !== 'undefined' ? loadLastCity() : null;

export const lastCityStore = writable<LastCity | null>(initial);

lastCityStore.subscribe((city) => {
  if (typeof window !== 'undefined' && city) {
    saveLastCity(city);
  }
});

export function setLastCity(city: LastCity) {
  lastCityStore.set(city);
} 