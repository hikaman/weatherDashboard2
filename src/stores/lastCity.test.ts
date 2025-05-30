import { describe, it, expect, vi, beforeEach } from 'vitest';
import { lastCityStore, setLastCity, type LastCity } from './lastCity';

const city: LastCity = { name: 'Berlin', latitude: 52.52, longitude: 13.405 };

describe('lastCityStore', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('sets and gets the last city', () => {
    setLastCity(city);
    let value: LastCity | null = null;
    lastCityStore.subscribe((v) => (value = v))();
    expect(value).toEqual(city);
  });

  it('persists to localStorage', () => {
    setLastCity(city);
    expect(localStorage.setItem).toHaveBeenCalledWith('weatherwise-last-city', JSON.stringify(city));
  });

  it('loads from localStorage', async () => {
    (localStorage.getItem as any).mockReturnValue(JSON.stringify(city));
    // Dynamic import to trigger load
    const mod = await import('./lastCity');
    let value: LastCity | null = null;
    mod.lastCityStore.subscribe((v: LastCity | null) => (value = v))();
    expect(value).toEqual(city);
  });
}); 