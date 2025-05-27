import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import UnifiedSuggestions from './UnifiedSuggestions.svelte';
import { suggestionFilterStore } from '../stores/suggestionFilter';

const mockWeather = {
  current: {
    temperature_2m: 20,
    precipitation: 0,
    wind_speed_10m: 10,
    weather_code: 1,
    relative_humidity_2m: 50
  },
  daily: { time: [], temperature_2m_max: [], temperature_2m_min: [], precipitation_sum: [], weather_code: [], wind_speed_10m_max: [] },
  hourly: { time: [], temperature_2m: [], precipitation_probability: [], precipitation: [], weather_code: [], wind_speed_10m: [], relative_humidity_2m: [] },
  latitude: 0, longitude: 0, timezone: 'UTC'
};

describe('UnifiedSuggestions', () => {
  it('renders suggestions for given weather', () => {
    const { getByText } = render(UnifiedSuggestions, { props: { weather: mockWeather } });
    expect(getByText(/Wardrobe/i)).toBeTruthy();
    expect(getByText(/Food/i)).toBeTruthy();
    expect(getByText(/Activities/i)).toBeTruthy();
    expect(getByText(/Exercises/i)).toBeTruthy();
  });

  it('responds to filter changes', async () => {
    const { getByLabelText, queryByText } = render(UnifiedSuggestions, { props: { weather: mockWeather } });
    const wardrobeToggle = getByLabelText('Toggle Wardrobe');
    await fireEvent.click(wardrobeToggle);
    expect(queryByText(/Wardrobe/i)).toBeNull();
  });

  it('has aria-live region for accessibility', () => {
    const { container } = render(UnifiedSuggestions, { props: { weather: mockWeather } });
    const region = container.querySelector('[aria-live="polite"]');
    expect(region).toBeTruthy();
  });

  it('suggestion cards are keyboard focusable', () => {
    const { container } = render(UnifiedSuggestions, { props: { weather: mockWeather } });
    const cards = container.querySelectorAll('.glass-card[tabindex="0"]');
    expect(cards.length).toBeGreaterThan(0);
  });
}); 