import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import WeatherDisplay from './WeatherDisplay.svelte';

const mockWeather = {
  current: {
    temperature_2m: 22,
    relative_humidity_2m: 55,
    wind_speed_10m: 12,
    precipitation: 0,
    weather_code: 1
  },
  daily: {
    time: ["2023-06-01", "2023-06-02", "2023-06-03"],
    temperature_2m_max: [24, 25, 23],
    temperature_2m_min: [14, 15, 13],
    precipitation_sum: [0, 1, 0],
    weather_code: [1, 2, 3],
    wind_speed_10m_max: [15, 16, 14]
  },
  hourly: { time: [], temperature_2m: [], precipitation_probability: [], precipitation: [], weather_code: [], wind_speed_10m: [], relative_humidity_2m: [] },
  latitude: 0, longitude: 0, timezone: 'UTC'
};

describe('WeatherDisplay', () => {
  it('renders the main weather card', () => {
    const { getByText } = render(WeatherDisplay, { props: { weather: mockWeather } });
    expect(getByText(/Current Weather/i)).toBeTruthy();
    expect(getByText(/22°C/)).toBeTruthy();
  });

  it('shows the animated weather icon', () => {
    const { container } = render(WeatherDisplay, { props: { weather: mockWeather } });
    expect(container.querySelector('svg')).toBeTruthy();
  });

  it('renders the 7-day forecast', () => {
    const { getByText } = render(WeatherDisplay, { props: { weather: mockWeather } });
    expect(getByText(/7-Day Forecast/i)).toBeTruthy();
    expect(getByText(/24°/)).toBeTruthy();
    expect(getByText(/14°/)).toBeTruthy();
  });
}); 