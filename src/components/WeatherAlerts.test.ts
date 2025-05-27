import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import WeatherAlerts from './WeatherAlerts.svelte';

vi.mock('../stores/weather', () => {
  const { writable } = require('svelte/store');
  return {
    weatherStore: writable({ data: {
      current: {
        precipitation: 20,
        windSpeed: 60,
        temperature: 40,
        humidity: 95,
        weatherCode: 96
      }
    } })
  };
});

describe('WeatherAlerts', () => {
  it('renders alerts for dangerous weather', () => {
    const { getByText } = render(WeatherAlerts);
    expect(getByText(/Heavy Rain Alert/i)).toBeTruthy();
    expect(getByText(/Strong Wind Warning/i)).toBeTruthy();
    expect(getByText(/Extreme Heat Warning/i)).toBeTruthy();
    expect(getByText(/High Humidity/i)).toBeTruthy();
    expect(getByText(/Thunderstorm Alert/i)).toBeTruthy();
  });

  it('alert cards are keyboard focusable', () => {
    const { container } = render(WeatherAlerts);
    const cards = container.querySelectorAll('.glass-card[tabindex="0"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('dismisses an alert when dismiss button is clicked', async () => {
    const { getByLabelText, queryByText } = render(WeatherAlerts);
    const dismissBtn = getByLabelText('Dismiss alert');
    await fireEvent.click(dismissBtn);
    expect(queryByText(/Heavy Rain Alert/i)).toBeNull();
  });
}); 