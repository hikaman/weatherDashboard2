<script lang="ts">
import type { WeatherData } from '../stores/weather';
import { t } from '../lib/i18n';
import AnimatedWeatherIcon from './AnimatedWeatherIcon.svelte';
import { isNightAtLocation as isNightAtLocationStore } from '../stores/weather';

export let index: number;
export let weather: WeatherData;

const day = {
  date: weather.daily.time[index],
  max: weather.daily.temperature_2m_max[index],
  min: weather.daily.temperature_2m_min[index],
  precip: weather.daily.precipitation_sum[index],
  precipProb: (() => {
    if (!weather.hourly?.precipitation_probability) return null;
    // Find all hours for this day
    const dayDate = weather.daily.time[index];
    const hours = weather.hourly.time
      .map((t, i) => ({ t, i }))
      .filter(({ t }) => t.startsWith(dayDate))
      .map(({ i }) => weather.hourly!.precipitation_probability[i]);
    if (!hours.length) return null;
    return hours.reduce((a, b) => a + b, 0) / hours.length;
  })(),
  wind: weather.daily.wind_speed_10m_max[index],
  code: weather.daily.weather_code[index],
  sunrise: weather.daily.sunrise[index],
  sunset: weather.daily.sunset[index],
};

$: isNight = $isNightAtLocationStore;

function formatDateShort(dateString: string): string {
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  if (date.toDateString() === today.toDateString()) return $t.today;
  if (date.toDateString() === tomorrow.toDateString()) return $t.tomorrow;
  const dayNames = [$t.sunday, $t.monday, $t.tuesday, $t.wednesday, $t.thursday, $t.friday, $t.saturday];
  return dayNames[date.getDay()];
}
</script>

<div class="compact-day-row flex flex-col items-center justify-between p-2 gap-1 rounded-glass cursor-pointer hover:bg-white/30 dark:hover:bg-slate-800/40 transition-all duration-200" tabindex="0">
  <div class="text-xs font-semibold text-glass mb-1">{formatDateShort(day.date)}</div>
  <span class="text-xl">
    <AnimatedWeatherIcon code={day.code} isNight={index === 0 ? isNight : false} />
  </span>
  <div class="text-base text-glass-secondary">{day.max}° / {day.min}°</div>
  <div class="text-blue-600 dark:text-blue-400 text-xs flex items-center gap-1">💧 {day.precip} mm <span class="ml-1">({day.precipProb === null ? '--' : Math.round(day.precipProb) + '%'})</span></div>
</div>

<style>
.compact-day-row {
  min-width: 70px;
  max-width: 90px;
  flex: 1 1 0;
  background: rgba(255,255,255,0.18);
  border-radius: 0.75rem;
  box-shadow: 0 1px 4px rgba(30,144,255,0.06);
  align-items: center;
  justify-content: center;
}
.compact-day-row:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
}
</style> 