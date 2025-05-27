import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/svelte';
import AnimatedWeatherIcon from './AnimatedWeatherIcon.svelte';

const codeMap = {
  clear: 0,
  'partly-cloudy': 2,
  rain: 61,
  snow: 71,
  thunder: 95,
  fog: 45,
  cloudy: 3
};

describe('AnimatedWeatherIcon', () => {
  it('renders sun for clear code', () => {
    const { container } = render(AnimatedWeatherIcon, { props: { code: codeMap.clear } });
    expect(container.querySelector('circle')).toBeTruthy();
  });
  it('renders sun+cloud for partly-cloudy code', () => {
    const { container } = render(AnimatedWeatherIcon, { props: { code: codeMap['partly-cloudy'] } });
    expect(container.querySelector('ellipse')).toBeTruthy();
    expect(container.querySelector('circle')).toBeTruthy();
  });
  it('renders rain for rain code', () => {
    const { container } = render(AnimatedWeatherIcon, { props: { code: codeMap.rain } });
    expect(container.querySelector('rect')).toBeTruthy();
  });
  it('renders snow for snow code', () => {
    const { container } = render(AnimatedWeatherIcon, { props: { code: codeMap.snow } });
    expect(container.querySelector('circle')).toBeTruthy();
  });
  it('renders thunder for thunder code', () => {
    const { container } = render(AnimatedWeatherIcon, { props: { code: codeMap.thunder } });
    expect(container.querySelector('polyline')).toBeTruthy();
  });
  it('renders fog for fog code', () => {
    const { container } = render(AnimatedWeatherIcon, { props: { code: codeMap.fog } });
    expect(container.querySelector('rect')).toBeTruthy();
  });
  it('renders cloud for cloudy code', () => {
    const { container } = render(AnimatedWeatherIcon, { props: { code: codeMap.cloudy } });
    expect(container.querySelector('ellipse')).toBeTruthy();
  });
}); 