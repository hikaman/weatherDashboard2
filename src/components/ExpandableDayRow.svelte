<script lang="ts">
import type { WeatherData } from '../stores/weather';
import { t } from '../lib/i18n';
import AnimatedWeatherIcon from './AnimatedWeatherIcon.svelte';

export let index: number;
export let weather: WeatherData;
export let expanded: boolean;
export let toggle: (idx: number) => void;

const day = {
  date: weather.daily.time[index],
  max: weather.daily.temperature_2m_max[index],
  min: weather.daily.temperature_2m_min[index],
  precip: weather.daily.precipitation_sum[index],
  wind: weather.daily.wind_speed_10m_max[index],
  code: weather.daily.weather_code[index],
  sunrise: weather.daily.sunrise[index],
  sunset: weather.daily.sunset[index],
};

function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return $t.today;
  if (date.toDateString() === tomorrow.toDateString()) return $t.tomorrow;
  const dayNames = [$t.sunday, $t.monday, $t.tuesday, $t.wednesday, $t.thursday, $t.friday, $t.saturday];
  const dayName = dayNames[date.getDay()];
  const dayNumber = date.getDate();
  const month = date.getMonth() + 1;
  return `${dayName} ${dayNumber}.${month}.`;
}
</script>

<div class="expandable-row glass-card rounded-glass mb-2" tabindex="0" role="button" aria-expanded={expanded} on:click={() => toggle(index)} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ') && toggle(index)}>
  <div class="row-summary flex items-center justify-between p-3 cursor-pointer">
    <div class="flex items-center gap-3">
      <span class="text-xl"><AnimatedWeatherIcon code={day.code} /></span>
      <span class="font-semibold text-glass">{formatDate(day.date)}</span>
      <span class="text-base text-glass-secondary">{day.max}° / {day.min}°</span>
      <span class="text-blue-600 dark:text-blue-400 text-sm ml-2">💧 {day.precip} mm</span>
    </div>
    <span class="ml-auto text-lg">{expanded ? '▲' : '▼'}</span>
  </div>
  {#if expanded}
    <div class="row-details p-3 pt-0 text-sm text-glass-secondary grid grid-cols-2 md:grid-cols-4 gap-2">
      <div><span class="font-semibold">{$t.windSpeed}:</span> {day.wind} km/h</div>
      <div><span class="font-semibold">{$t.precipitation}:</span> {day.precip} mm</div>
      <div><span class="font-semibold">🌅 Sunrise:</span> {new Date(day.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div><span class="font-semibold">🌇 Sunset:</span> {new Date(day.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
      <div class="col-span-2 md:col-span-4 mt-2"><span class="font-semibold">{$t.temperature}:</span> {day.max}° / {day.min}°</div>
      <div class="col-span-2 md:col-span-4"><span class="font-semibold">{$t.currentWeather}:</span> {day.code}</div>
    </div>
  {/if}
</div>

<style>
.expandable-row {
  transition: box-shadow 0.2s, background 0.2s;
  outline: none;
}
.expandable-row:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
}
.row-summary {
  user-select: none;
}
</style> 