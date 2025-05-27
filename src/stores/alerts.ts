import { writable } from 'svelte/store';

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
    alerts.push({ type: 'uv', message: 'High UV index! Take sun protection.', severity: 'warning' });
  }
  // AQI
  if (airQuality?.european_aqi >= thresholds.aqi) {
    alerts.push({ type: 'aqi', message: 'Poor air quality! Limit outdoor activity.', severity: 'warning' });
  }
  // Rain
  if (hourly.precipitation.some((v: number) => v >= thresholds.rain)) {
    alerts.push({ type: 'rain', message: 'Heavy rain expected today.', severity: 'info' });
  }
  // Temp
  if (hourly.temperature_2m.some((v: number) => v >= thresholds.tempHigh)) {
    alerts.push({ type: 'tempHigh', message: 'Very hot temperatures expected.', severity: 'danger' });
  }
  if (hourly.temperature_2m.some((v: number) => v <= thresholds.tempLow)) {
    alerts.push({ type: 'tempLow', message: 'Very cold temperatures expected.', severity: 'danger' });
  }
  // Wind
  if (hourly.wind_speed_10m.some((v: number) => v >= thresholds.wind)) {
    alerts.push({ type: 'wind', message: 'Strong winds expected.', severity: 'info' });
  }
  alertsStore.set(alerts);
} 