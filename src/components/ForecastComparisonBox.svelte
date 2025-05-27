<script lang="ts">
import { weatherStore } from '../stores/weather';
import { derived } from 'svelte/store';
import { t } from '../lib/i18n';

// Helper to get index for yesterday, today, tomorrow
function getDayIndices(daily: { time: string[] }) {
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);
  const idxToday = daily.time.findIndex((d) => d === todayStr);
  return {
    idxYesterday: idxToday - 1,
    idxToday,
    idxTomorrow: idxToday + 1,
  };
}

const comparisonData = derived(weatherStore, ($weatherStore) => {
  if (!$weatherStore.data) return null;
  const { daily } = $weatherStore.data;
  const { idxYesterday, idxToday, idxTomorrow } = getDayIndices(daily);
  if (
    idxYesterday < 0 ||
    idxToday < 0 ||
    idxTomorrow < 0 ||
    !daily.temperature_2m_max[idxYesterday] ||
    !daily.temperature_2m_max[idxToday] ||
    !daily.temperature_2m_max[idxTomorrow]
  ) {
    return null;
  }
  return {
    yesterday: {
      date: daily.time[idxYesterday],
      max: daily.temperature_2m_max[idxYesterday],
      min: daily.temperature_2m_min[idxYesterday],
      precip: daily.precipitation_sum[idxYesterday],
      code: daily.weather_code[idxYesterday],
      wind: daily.wind_speed_10m_max[idxYesterday],
    },
    today: {
      date: daily.time[idxToday],
      max: daily.temperature_2m_max[idxToday],
      min: daily.temperature_2m_min[idxToday],
      precip: daily.precipitation_sum[idxToday],
      code: daily.weather_code[idxToday],
      wind: daily.wind_speed_10m_max[idxToday],
    },
    tomorrow: {
      date: daily.time[idxTomorrow],
      max: daily.temperature_2m_max[idxTomorrow],
      min: daily.temperature_2m_min[idxTomorrow],
      precip: daily.precipitation_sum[idxTomorrow],
      code: daily.weather_code[idxTomorrow],
      wind: daily.wind_speed_10m_max[idxTomorrow],
    },
  };
});

function diff(a: number, b: number) {
  if (a === undefined || b === undefined) return null;
  if (a > b) return 'up';
  if (a < b) return 'down';
  return 'same';
}

// Helper for typed day mapping
type DayLabel = 'yesterday' | 'today' | 'tomorrow';
const dayOrder: { label: DayLabel; display: string }[] = [
  { label: 'yesterday', display: 'Yesterday' },
  { label: 'today', display: 'Today' },
  { label: 'tomorrow', display: 'Tomorrow' },
];

// Generate automated prose summary
function getTrendText(today: number, yesterday: number) {
  if (today > yesterday) return 'slightly warmer';
  if (today < yesterday) return 'slightly cooler';
  return 'about the same temperature';
}
function getPrecipText(today: number, yesterday: number) {
  if (today > yesterday) return 'more precipitation';
  if (today < yesterday) return 'less precipitation';
  return 'no change in precipitation';
}

interface ComparisonDay {
  max: number;
  min: number;
  precip: number;
  wind: number;
}

interface ComparisonData {
  yesterday: ComparisonDay;
  today: ComparisonDay;
  tomorrow: ComparisonDay;
}

function proseSummary(data: ComparisonData | null, $t: any) {
  if (!data) return '';
  if ($t.today === 'Heute') {
    // German
    const tempTrend = getTrendText(data.today.max, data.yesterday.max) === 'slightly warmer' ? 'etwas wärmer' : getTrendText(data.today.max, data.yesterday.max) === 'slightly cooler' ? 'etwas kühler' : 'ungefähr gleich warm';
    const precipTrend = getPrecipText(data.today.precip, data.yesterday.precip) === 'more precipitation' ? 'mehr Niederschlag' : getPrecipText(data.today.precip, data.yesterday.precip) === 'less precipitation' ? 'weniger Niederschlag' : 'keine Änderung beim Niederschlag';
    const tomorrowTrend = getTrendText(data.tomorrow.max, data.today.max) === 'slightly warmer' ? 'etwas wärmer' : getTrendText(data.tomorrow.max, data.today.max) === 'slightly cooler' ? 'etwas kühler' : 'ungefähr gleich warm';
    const tomorrowPrecip = getPrecipText(data.tomorrow.precip, data.today.precip) === 'more precipitation' ? 'mehr Niederschlag' : getPrecipText(data.tomorrow.precip, data.today.precip) === 'less precipitation' ? 'weniger Niederschlag' : 'keine Änderung beim Niederschlag';
    return `Gestern lag die Höchsttemperatur bei ${data.yesterday.max.toFixed(1)}°C und die Tiefsttemperatur bei ${data.yesterday.min.toFixed(1)}°C. Der Wind erreichte bis zu ${data.yesterday.wind.toFixed(1)} km/h, und es fielen ${data.yesterday.precip.toFixed(1)} mm Niederschlag. Heute ist es ${tempTrend} (${data.today.max.toFixed(1)}°C), mit ${precipTrend}. Für morgen wird ${tomorrowTrend} (${data.tomorrow.max.toFixed(1)}°C) und ${tomorrowPrecip} erwartet.`;
  } else {
    // English
    const tempTrend = getTrendText(data.today.max, data.yesterday.max);
    const precipTrend = getPrecipText(data.today.precip, data.yesterday.precip);
    const tomorrowTrend = getTrendText(data.tomorrow.max, data.today.max);
    const tomorrowPrecip = getPrecipText(data.tomorrow.precip, data.today.precip);
    return `Yesterday, the maximum temperature was ${data.yesterday.max.toFixed(1)}°C with a minimum of ${data.yesterday.min.toFixed(1)}°C. Winds reached up to ${data.yesterday.wind.toFixed(1)} km/h, and there was ${data.yesterday.precip.toFixed(1)} mm of precipitation. Today is ${tempTrend} (${data.today.max.toFixed(1)}°C), with ${precipTrend}. Looking ahead, tomorrow is expected to be ${tomorrowTrend} (${data.tomorrow.max.toFixed(1)}°C) with ${tomorrowPrecip}.`;
  }
}
</script>

<style>
.comparison-box {
  background: rgba(255,255,255,0.15);
  border-radius: 1rem;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  backdrop-filter: blur(12px);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  width: 100%;
}
.days {
  display: grid;
  gap: 0.5rem;
  align-items: stretch;
}
.days.three {
  grid-template-columns: repeat(3, 1fr);
}
.days.two {
  grid-template-columns: repeat(2, 1fr);
}
.day {
  background: rgba(255,255,255,0.18);
  border-radius: 0.6rem;
  padding: 0.6rem 0.5rem;
  text-align: center;
  min-height: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.metric {
  font-size: 0.98rem;
  margin: 0.12rem 0;
}
.diff-up { color: #1e90ff; font-weight: bold; }
.diff-down { color: #e74c3c; font-weight: bold; }
.diff-same { color: #888; }
@media (max-width: 600px) {
  .days.three { grid-template-columns: 1fr; }
  .days.two { grid-template-columns: 1fr; }
}
.prose-summary {
  background: rgba(255,255,255,0.18);
  border-radius: 0.75rem;
  padding: 0.75rem 1rem;
  margin-bottom: 0.5rem;
  font-size: 1.25em;
  color: #222;
}
</style>

<div class="comparison-box" aria-label="Forecast comparison for yesterday, today, and tomorrow">
  {#if $weatherStore.loading}
    <div>Loading forecast comparison…</div>
  {:else if $weatherStore.error}
    <div>Error loading weather data.</div>
  {:else if $comparisonData}
    <div class="mb-3 prose-summary" style="font-size:1.05em;color:#222;">
      {proseSummary($comparisonData, $t)}
    </div>
    <div style="margin-top:1rem;">
      <strong>{($t.today === 'Heute' ? 'Veränderungen' : 'Changes')}:</strong>
      <div class="days two" style="font-size:0.97em;">
        <div class="day" aria-label="Yesterday to Today">
          <div class="metric">
            {($t.temperature || ($t.today === 'Heute' ? 'Höchsttemperatur' : 'Max Temperature'))}: <span class={"diff-" + diff($comparisonData.today.max, $comparisonData.yesterday.max)}>
              {#if diff($comparisonData.today.max, $comparisonData.yesterday.max) === 'up'}↑{/if}
              {#if diff($comparisonData.today.max, $comparisonData.yesterday.max) === 'down'}↓{/if}
              {Math.abs($comparisonData.today.max - $comparisonData.yesterday.max).toFixed(1)}°C
            </span>
          </div>
          <div class="metric">
            {($t.precipitation || ($t.today === 'Heute' ? 'Niederschlag' : 'Precipitation'))}: <span class={"diff-" + diff($comparisonData.today.precip, $comparisonData.yesterday.precip)}>
              {#if diff($comparisonData.today.precip, $comparisonData.yesterday.precip) === 'up'}↑{/if}
              {#if diff($comparisonData.today.precip, $comparisonData.yesterday.precip) === 'down'}↓{/if}
              {Math.abs($comparisonData.today.precip - $comparisonData.yesterday.precip).toFixed(1)} mm
            </span>
          </div>
          <div class="metric">
            {($t.windSpeed || ($t.today === 'Heute' ? 'Windgeschwindigkeit' : 'Wind Speed'))}: <span class={"diff-" + diff($comparisonData.today.wind, $comparisonData.yesterday.wind)}>
              {#if diff($comparisonData.today.wind, $comparisonData.yesterday.wind) === 'up'}↑{/if}
              {#if diff($comparisonData.today.wind, $comparisonData.yesterday.wind) === 'down'}↓{/if}
              {Math.abs($comparisonData.today.wind - $comparisonData.yesterday.wind).toFixed(1)} km/h
            </span>
          </div>
        </div>
        <div class="day" aria-label="Today to Tomorrow">
          <div class="metric">
            {($t.temperature || ($t.today === 'Heute' ? 'Höchsttemperatur' : 'Max Temperature'))}: <span class={"diff-" + diff($comparisonData.tomorrow.max, $comparisonData.today.max)}>
              {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'up'}↑{/if}
              {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'down'}↓{/if}
              {Math.abs($comparisonData.tomorrow.max - $comparisonData.today.max).toFixed(1)}°C
            </span>
          </div>
          <div class="metric">
            {($t.precipitation || ($t.today === 'Heute' ? 'Niederschlag' : 'Precipitation'))}: <span class={"diff-" + diff($comparisonData.tomorrow.precip, $comparisonData.today.precip)}>
              {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'up'}↑{/if}
              {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'down'}↓{/if}
              {Math.abs($comparisonData.tomorrow.precip - $comparisonData.today.precip).toFixed(1)} mm
            </span>
          </div>
          <div class="metric">
            {($t.windSpeed || ($t.today === 'Heute' ? 'Windgeschwindigkeit' : 'Wind Speed'))}: <span class={"diff-" + diff($comparisonData.tomorrow.wind, $comparisonData.today.wind)}>
              {#if diff($comparisonData.tomorrow.wind, $comparisonData.today.wind) === 'up'}↑{/if}
              {#if diff($comparisonData.tomorrow.wind, $comparisonData.today.wind) === 'down'}↓{/if}
              {Math.abs($comparisonData.tomorrow.wind - $comparisonData.today.wind).toFixed(1)} km/h
            </span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div>No forecast comparison data available.</div>
  {/if}
</div> 