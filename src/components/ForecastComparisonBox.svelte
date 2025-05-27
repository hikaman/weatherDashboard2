<script lang="ts">
import { weatherStore } from '../stores/weather';
import { derived } from 'svelte/store';

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
  max-width: 600px;
  margin: 0 auto;
}
.days {
  display: flex;
  gap: 1rem;
  justify-content: space-between;
}
.day {
  flex: 1 1 0;
  background: rgba(255,255,255,0.25);
  border-radius: 0.75rem;
  padding: 1rem;
  text-align: center;
}
.metric {
  font-size: 1.1rem;
  margin: 0.25rem 0;
}
.diff-up { color: #1e90ff; font-weight: bold; }
.diff-down { color: #e74c3c; font-weight: bold; }
.diff-same { color: #888; }
@media (max-width: 600px) {
  .days { flex-direction: column; }
}
</style>

<div class="comparison-box" aria-label="Forecast comparison for yesterday, today, and tomorrow">
  {#if $weatherStore.loading}
    <div>Loading forecast comparison…</div>
  {:else if $weatherStore.error}
    <div>Error loading weather data.</div>
  {:else if $comparisonData}
    <div class="days">
      {#each ['yesterday', 'today', 'tomorrow'] as label, i}
        {#key label}
          <div class="day" aria-label={label} tabindex="0">
            <div><strong>{label.charAt(0).toUpperCase() + label.slice(1)}</strong></div>
            <div class="metric">Max: { $comparisonData[label].max }°C</div>
            <div class="metric">Min: { $comparisonData[label].min }°C</div>
            <div class="metric">Precip: { $comparisonData[label].precip } mm</div>
            <div class="metric">Wind: { $comparisonData[label].wind } km/h</div>
          </div>
        {/key}
      {/each}
    </div>
    <div style="margin-top:1rem;">
      <strong>Changes:</strong>
      <div class="days">
        <div class="day" aria-label="Yesterday to Today">
          <div class="metric">
            Max Temp: <span class={"diff-" + diff($comparisonData.today.max, $comparisonData.yesterday.max)}>
              {#if diff($comparisonData.today.max, $comparisonData.yesterday.max) === 'up'}↑{/if}
              {#if diff($comparisonData.today.max, $comparisonData.yesterday.max) === 'down'}↓{/if}
              {Math.abs($comparisonData.today.max - $comparisonData.yesterday.max).toFixed(1)}°C
            </span>
          </div>
          <div class="metric">
            Precip: <span class={"diff-" + diff($comparisonData.today.precip, $comparisonData.yesterday.precip)}>
              {#if diff($comparisonData.today.precip, $comparisonData.yesterday.precip) === 'up'}↑{/if}
              {#if diff($comparisonData.today.precip, $comparisonData.yesterday.precip) === 'down'}↓{/if}
              {Math.abs($comparisonData.today.precip - $comparisonData.yesterday.precip).toFixed(1)} mm
            </span>
          </div>
        </div>
        <div class="day" aria-label="Today to Tomorrow">
          <div class="metric">
            Max Temp: <span class={"diff-" + diff($comparisonData.tomorrow.max, $comparisonData.today.max)}>
              {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'up'}↑{/if}
              {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'down'}↓{/if}
              {Math.abs($comparisonData.tomorrow.max - $comparisonData.today.max).toFixed(1)}°C
            </span>
          </div>
          <div class="metric">
            Precip: <span class={"diff-" + diff($comparisonData.tomorrow.precip, $comparisonData.today.precip)}>
              {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'up'}↑{/if}
              {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'down'}↓{/if}
              {Math.abs($comparisonData.tomorrow.precip - $comparisonData.today.precip).toFixed(1)} mm
            </span>
          </div>
        </div>
      </div>
    </div>
  {:else}
    <div>No forecast comparison data available.</div>
  {/if}
</div> 