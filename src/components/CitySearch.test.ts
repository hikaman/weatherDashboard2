import { describe, it, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import CitySearch from './CitySearch.svelte';
import * as weatherStore from '../stores/weather';

const mockResults = [
  { name: 'Berlin', latitude: 52.52, longitude: 13.405, country: 'Germany' },
  { name: 'Paris', latitude: 48.8566, longitude: 2.3522, country: 'France' }
];

describe('CitySearch', () => {
  it('renders the input with aria-label', () => {
    const { getByLabelText } = render(CitySearch, { props: { currentLocation: 'Berlin' } });
    expect(getByLabelText('Search for a city')).toBeTruthy();
  });

  it('shows search results on input', async () => {
    vi.spyOn(weatherStore, 'searchCities').mockResolvedValue(mockResults);
    const { getByLabelText, findByText } = render(CitySearch, { props: { currentLocation: 'Berlin' } });
    const input = getByLabelText('Search for a city');
    await fireEvent.input(input, { target: { value: 'Ber' } });
    expect(await findByText('Berlin')).toBeTruthy();
    expect(await findByText('Paris')).toBeTruthy();
  });

  it('input is keyboard focusable', () => {
    const { getByLabelText } = render(CitySearch, { props: { currentLocation: 'Berlin' } });
    const input = getByLabelText('Search for a city');
    input.focus();
    expect(document.activeElement).toBe(input);
  });
}); 