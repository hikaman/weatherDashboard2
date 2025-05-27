<script lang="ts">
import { weatherStore } from '../stores/weather';
import { airQualityStore } from '../stores/airQuality';
import { t } from '../lib/i18n';
import { derived } from 'svelte/store';

// Helper: get hour from ISO string
function getHour(time: string) {
  return new Date(time).getHours();
}

// Derive recommendations for the next 24 hours
const recommendations = derived([
  weatherStore,
  airQualityStore
], ([$weather, $aq]) => {
  const hourly = $weather.data?.hourly;
  if (!hourly) return [];
  const now = new Date();
  const today = now.toISOString().slice(0, 10);
  const slots = [];
  for (let i = 0; i < 24; i++) {
    const time = hourly.time[i];
    if (!time.startsWith(today)) continue;
    const temp = hourly.temperature_2m[i];
    const precip = hourly.precipitation[i];
    const uv = hourly.uv_index?.[i] ?? null;
    const aqi = $aq.data?.european_aqi ?? null;
    // Outdoor: 12–25°C, precip < 0.2, UV < 6, AQI < 40
    if (temp >= 12 && temp <= 25 && precip < 0.2 && (uv === null || uv < 6) && (aqi === null || aqi < 40)) {
      slots.push({
        type: 'outdoor',
        time,
        icon: '🏃‍♂️',
        reason: `${t('outdoorAdventures')}: ${Math.round(temp)}°C, UV ${uv ?? '-'}, AQI ${aqi ?? '-'}`
      });
    }
    // Indoor: precip > 1 or temp < 8 or temp > 28 or AQI > 60
    else if (precip > 1 || temp < 8 || temp > 28 || (aqi !== null && aqi > 60)) {
      slots.push({
        type: 'indoor',
        time,
        icon: '🏠',
        reason: `${t('indoorActivities')}: ${Math.round(temp)}°C, ${precip}mm, AQI ${aqi ?? '-'}`
      });
    }
    // Exercise: 10–22°C, precip < 0.1, UV < 5, AQI < 30
    else if (temp >= 10 && temp <= 22 && precip < 0.1 && (uv === null || uv < 5) && (aqi === null || aqi < 30)) {
      slots.push({
        type: 'exercise',
        time,
        icon: '🤸‍♂️',
        reason: `${t('exercise')}: ${Math.round(temp)}°C, UV ${uv ?? '-'}, AQI ${aqi ?? '-'}`
      });
    }
  }
  return slots;
});
</script>

<div class="smart-activity-planner glass-card-lg p-4 mb-6" aria-label="Smart Activity Planner">
  <h3 class="text-lg font-bold text-glass mb-3 flex items-center">
    <span class="text-xl mr-2">🧭</span>
    {$t.smartSuggestions}
  </h3>
  {#if $recommendations.length > 0}
    <div class="flex flex-wrap gap-3">
      {#each $recommendations as slot}
        <div class="activity-slot chip flex items-center gap-2 px-3 py-2" aria-label={slot.reason}>
          <span class="text-xl">{slot.icon}</span>
          <span class="font-semibold text-glass-secondary">{new Date(slot.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
          <span class="text-xs text-glass-muted">{slot.reason}</span>
        </div>
      {/each}
    </div>
  {:else}
    <div class="text-glass-secondary text-sm">{$t.noSuggestionsData}</div>
  {/if}
</div>

<style>
.smart-activity-planner {
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(30,144,255,0.08);
}
.activity-slot {
  border-radius: 9999px;
  background: rgba(255,255,255,0.7);
  box-shadow: 0 1px 4px rgba(30,144,255,0.08);
  font-size: 1em;
  font-weight: 500;
  min-width: 120px;
  transition: background 0.2s;
}
.activity-slot:hover {
  background: #e0e7ef;
}
</style> 