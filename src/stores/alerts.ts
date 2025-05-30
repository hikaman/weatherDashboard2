import { writable, get } from 'svelte/store';
import { t } from '../lib/i18n';

export interface WeatherAlert {
  type: string;
  message: string;
  severity: 'info' | 'warning' | 'danger';
}

export const alertsStore = writable<WeatherAlert[]>([]);

// Default thresholds
const thresholds = {
  uv: 7,
  aqi: 60,
  rain: 5, // mm
  tempHigh: 32,
  tempLow: -5,
  wind: 40, // km/h
};

export function checkWeatherAlerts({ hourly, current }: any, airQuality: any) {
  const alerts: WeatherAlert[] = [];
  if (!hourly || !current) return alertsStore.set([]);
  // UV
  if (current.uv_index >= thresholds.uv) {
    alerts.push({ type: 'uv', message: get(t).alertUV, severity: 'warning' });
  }
  // AQI
  if (airQuality?.european_aqi >= thresholds.aqi) {
    alerts.push({ type: 'aqi', message: get(t).alertAQI, severity: 'warning' });
  }
  // Rain
  if (hourly.precipitation.some((v: number) => v >= thresholds.rain)) {
    alerts.push({ type: 'rain', message: get(t).alertRain, severity: 'info' });
  }
  // Temp
  if (hourly.temperature_2m.some((v: number) => v >= thresholds.tempHigh)) {
    alerts.push({ type: 'tempHigh', message: get(t).alertHot, severity: 'danger' });
  }
  if (hourly.temperature_2m.some((v: number) => v <= thresholds.tempLow)) {
    alerts.push({ type: 'tempLow', message: get(t).alertCold, severity: 'danger' });
  }
  // Wind
  if (hourly.wind_speed_10m.some((v: number) => v >= thresholds.wind)) {
    alerts.push({ type: 'wind', message: get(t).alertWind, severity: 'info' });
  }
  alertsStore.set(alerts);
} 