<script lang="ts">
import { weatherStore } from '../stores/weather';
import { derived } from 'svelte/store';
import { t } from '../lib/i18n';
import { onMount } from 'svelte';

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
  if (!$weatherStore.data) {
    if ($weatherStore.error) {
      console.log('[ForecastComparisonBox] Weather store error:', $weatherStore.error);
    } else {
      console.log('[ForecastComparisonBox] No weather data available in store.');
    }
    return null;
  }
  const { daily } = $weatherStore.data;
  const { idxYesterday, idxToday, idxTomorrow } = getDayIndices(daily);
  // Defensive: Check indices are within bounds for today/tomorrow only
  const validIndices = [idxToday, idxTomorrow].every(idx => idx >= 0 && idx < daily.time.length);
  if (!validIndices) {
    // Instead of returning null, just skip rendering those days
    return {
      yesterday: null,
      today: null,
      tomorrow: null
    };
  }
  // Defensive: Check all required data fields are present for today/tomorrow
  const requiredFields = [
    daily.temperature_2m_max,
    daily.temperature_2m_min,
    daily.precipitation_sum,
    daily.weather_code,
    daily.wind_speed_10m_max
  ];
  const allFieldsPresent = requiredFields.every(arr =>
    [idxToday, idxTomorrow].every(idx => arr[idx] !== undefined && arr[idx] !== null)
  );
  // If today/tomorrow data is missing, show a friendly message but don't block UI
  if (!allFieldsPresent) {
    return {
      yesterday: null,
      today: null,
      tomorrow: null
    };
  }
  // Only include yesterday if available
  let yesterday = null;
  if (idxYesterday >= 0 && idxYesterday < daily.time.length && requiredFields.every(arr => arr[idxYesterday] !== undefined && arr[idxYesterday] !== null)) {
    yesterday = {
      date: daily.time[idxYesterday],
      max: daily.temperature_2m_max[idxYesterday],
      min: daily.temperature_2m_min[idxYesterday],
      precip: daily.precipitation_sum[idxYesterday],
      code: daily.weather_code[idxYesterday],
      wind: daily.wind_speed_10m_max[idxYesterday],
    };
  }
  return {
    yesterday,
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
  yesterday: ComparisonDay | null;
  today: ComparisonDay;
  tomorrow: ComparisonDay;
}

function proseSummary(data: ComparisonData | null, $t: any) {
  if (!data || !data.yesterday) return '';

  // Helper to build descriptive phrases
  const describeWind = (speed: number) => `${speed.toFixed(1)} km/h`;

  if ($t.today === 'Heute') {
    // German
    const tempTrendToday = getTrendText(data.today.max, data.yesterday.max) === 'slightly warmer' ? 'wärmer' : getTrendText(data.today.max, data.yesterday.max) === 'slightly cooler' ? 'kühler' : 'ähnlich warm';
    const precipTrendToday = getPrecipText(data.today.precip, data.yesterday.precip) === 'more precipitation' ? 'mehr Niederschlag' : getPrecipText(data.today.precip, data.yesterday.precip) === 'less precipitation' ? 'weniger Niederschlag' : 'ähnlichen Niederschlag';

    const tempTrendTomorrow = getTrendText(data.tomorrow.max, data.today.max) === 'slightly warmer' ? 'wärmer' : getTrendText(data.tomorrow.max, data.today.max) === 'slightly cooler' ? 'kühler' : 'ähnlich warm';
    const precipTrendTomorrow = getPrecipText(data.tomorrow.precip, data.today.precip) === 'more precipitation' ? 'mehr Niederschlag' : getPrecipText(data.tomorrow.precip, data.today.precip) === 'less precipitation' ? 'weniger Niederschlag' : 'ähnlichen Niederschlag';

    return `Gestern lag die Höchsttemperatur bei ${data.yesterday.max.toFixed(1)}°C, die Tiefsttemperatur bei ${data.yesterday.min.toFixed(1)}°C und der Wind erreichte ${describeWind(data.yesterday.wind)}. Insgesamt fielen ${data.yesterday.precip.toFixed(1)} mm Niederschlag.` +
    ` Heute wird es ${tempTrendToday} – die Temperaturen bewegen sich zwischen ${data.today.min.toFixed(1)}°C und ${data.today.max.toFixed(1)}°C. ` +
    `Es ist mit ${precipTrendToday} (${data.today.precip.toFixed(1)} mm) und Windgeschwindigkeiten um ${describeWind(data.today.wind)} zu rechnen.` +
    ` Für morgen zeichnet sich ein ${tempTrendTomorrow} Tag ab (≈ ${data.tomorrow.max.toFixed(1)}°C / ${data.tomorrow.min.toFixed(1)}°C) bei ${precipTrendTomorrow} (${data.tomorrow.precip.toFixed(1)} mm) und einem erwarteten Wind um ${describeWind(data.tomorrow.wind)}.`;
  } else {
    // English
    const tempTrendToday = getTrendText(data.today.max, data.yesterday.max);
    const precipTrendToday = getPrecipText(data.today.precip, data.yesterday.precip);

    const tempTrendTomorrow = getTrendText(data.tomorrow.max, data.today.max);
    const precipTrendTomorrow = getPrecipText(data.tomorrow.precip, data.today.precip);

    return `Yesterday featured a high of ${data.yesterday.max.toFixed(1)}°C and a low of ${data.yesterday.min.toFixed(1)}°C. Winds peaked at ${describeWind(data.yesterday.wind)}, accompanied by ${data.yesterday.precip.toFixed(1)} mm of precipitation.` +
    ` Today will feel ${tempTrendToday}, ranging between ${data.today.min.toFixed(1)}°C and ${data.today.max.toFixed(1)}°C, with ${precipTrendToday} expected (${data.today.precip.toFixed(1)} mm) and winds around ${describeWind(data.today.wind)}.` +
    ` Looking ahead, tomorrow should be ${tempTrendTomorrow}, topping out near ${data.tomorrow.max.toFixed(1)}°C (low of ${data.tomorrow.min.toFixed(1)}°C). Expect ${precipTrendTomorrow} (${data.tomorrow.precip.toFixed(1)} mm) and winds close to ${describeWind(data.tomorrow.wind)}.`;
  }
}

onMount(() => {
  console.log('[ForecastComparisonBox] Component mounted.');
});
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
.day-label {
  font-size: 1.05em;
  color: #444;
  margin-bottom: 0.25rem;
  text-align: left;
  font-family: inherit;
  font-weight: 600;
  letter-spacing: 0.01em;
  padding-left: 0.1em;
}
.forecast-header {
  display: flex;
  align-items: center;
  gap: 0.7em;
  margin-bottom: 0.7em;
  font-family: inherit;
  font-size: 1.25em;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 0.01em;
}
.logo-svg {
  display: flex;
  align-items: center;
}
.logo-text {
  font-family: inherit;
  font-size: 1.1em;
  font-weight: 700;
  color: #2563eb;
  letter-spacing: 0.01em;
}
</style>

<div class="forecast-header">
  <span class="logo-svg" aria-label="wetter.tools logo">
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style="vertical-align:middle;">
      <circle cx="16" cy="16" r="12" fill="#facc15"/>
      <ellipse cx="22" cy="22" rx="8" ry="5" fill="#60a5fa"/>
      <ellipse cx="12" cy="22" rx="6" ry="4" fill="#bae6fd"/>
    </svg>
  </span>
  <span class="logo-text">wetter.tools</span>
</div>

<div class="comparison-box" aria-label="{$t.forecastComparisonAriaLabel}">
  {#if $weatherStore.loading}
    <div>{$t.loadingForecastComparison}</div>
  {:else if $comparisonData && ($comparisonData.today || $comparisonData.tomorrow)}
    {#if $comparisonData.yesterday}
      <div class="mb-3 prose-summary" style="font-size:1.05em;color:#222;">
        {proseSummary($comparisonData, $t)}
      </div>
      <div style="margin-top:1rem;">
        <strong>{$t.changes}:</strong>
        <div class="days two" style="font-size:0.97em;">
          <div class="day" aria-label="{$t.yesterdayToToday}">
            <div class="day-label">{$t.yesterday}</div>
            <div class="metric">
              {($t.temperature || $t.maxTemperature)}: <span class={"diff-" + diff($comparisonData.today.max, $comparisonData.yesterday.max)}>
                {#if diff($comparisonData.today.max, $comparisonData.yesterday.max) === 'up'}↑{/if}
                {#if diff($comparisonData.today.max, $comparisonData.yesterday.max) === 'down'}↓{/if}
                {Math.abs($comparisonData.today.max - $comparisonData.yesterday.max).toFixed(1)}°C
              </span>
            </div>
            <div class="metric">
              {$t.precipitation}: <span class={"diff-" + diff($comparisonData.today.precip, $comparisonData.yesterday.precip)}>
                {#if diff($comparisonData.today.precip, $comparisonData.yesterday.precip) === 'up'}↑{/if}
                {#if diff($comparisonData.today.precip, $comparisonData.yesterday.precip) === 'down'}↓{/if}
                {Math.abs($comparisonData.today.precip - $comparisonData.yesterday.precip).toFixed(1)} mm
              </span>
            </div>
            <div class="metric">
              {$t.windSpeed}: <span class={"diff-" + diff($comparisonData.today.wind, $comparisonData.yesterday.wind)}>
                {#if diff($comparisonData.today.wind, $comparisonData.yesterday.wind) === 'up'}↑{/if}
                {#if diff($comparisonData.today.wind, $comparisonData.yesterday.wind) === 'down'}↓{/if}
                {Math.abs($comparisonData.today.wind - $comparisonData.yesterday.wind).toFixed(1)} km/h
              </span>
            </div>
          </div>
          <div class="day" aria-label="{$t.todayToTomorrow}">
            <div class="day-label">{$t.tomorrow}</div>
            <div class="metric">
              {($t.temperature || $t.maxTemperature)}: <span class={"diff-" + diff($comparisonData.tomorrow.max, $comparisonData.today.max)}>
                {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'up'}↑{/if}
                {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'down'}↓{/if}
                {Math.abs($comparisonData.tomorrow.max - $comparisonData.today.max).toFixed(1)}°C
              </span>
            </div>
            <div class="metric">
              {$t.precipitation}: <span class={"diff-" + diff($comparisonData.tomorrow.precip, $comparisonData.today.precip)}>
                {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'up'}↑{/if}
                {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'down'}↓{/if}
                {Math.abs($comparisonData.tomorrow.precip - $comparisonData.today.precip).toFixed(1)} mm
              </span>
            </div>
            <div class="metric">
              {$t.windSpeed}: <span class={"diff-" + diff($comparisonData.tomorrow.wind, $comparisonData.today.wind)}>
                {#if diff($comparisonData.tomorrow.wind, $comparisonData.today.wind) === 'up'}↑{/if}
                {#if diff($comparisonData.tomorrow.wind, $comparisonData.today.wind) === 'down'}↓{/if}
                {Math.abs($comparisonData.tomorrow.wind - $comparisonData.today.wind).toFixed(1)} km/h
              </span>
            </div>
          </div>
        </div>
      </div>
    {:else}
      <div>{$t.noYesterdayDataAvailable}. Showing today and tomorrow only.</div>
      <div style="margin-top:1rem;">
        <strong>{$t.changes}:</strong>
        <div class="days two" style="font-size:0.97em;">
          <div class="day" aria-label="{$t.todayToTomorrow}">
            <div class="day-label">{$t.today}</div>
            <div class="metric">
              {($t.temperature || $t.maxTemperature)}: <span class={"diff-" + diff($comparisonData.tomorrow.max, $comparisonData.today.max)}>
                {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'up'}↑{/if}
                {#if diff($comparisonData.tomorrow.max, $comparisonData.today.max) === 'down'}↓{/if}
                {Math.abs($comparisonData.tomorrow.max - $comparisonData.today.max).toFixed(1)}°C
              </span>
            </div>
            <div class="metric">
              {$t.precipitation}: <span class={"diff-" + diff($comparisonData.tomorrow.precip, $comparisonData.today.precip)}>
                {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'up'}↑{/if}
                {#if diff($comparisonData.tomorrow.precip, $comparisonData.today.precip) === 'down'}↓{/if}
                {Math.abs($comparisonData.tomorrow.precip - $comparisonData.today.precip).toFixed(1)} mm
              </span>
            </div>
            <div class="metric">
              {$t.windSpeed}: <span class={"diff-" + diff($comparisonData.tomorrow.wind, $comparisonData.today.wind)}>
                {#if diff($comparisonData.tomorrow.wind, $comparisonData.today.wind) === 'up'}↑{/if}
                {#if diff($comparisonData.tomorrow.wind, $comparisonData.today.wind) === 'down'}↓{/if}
                {Math.abs($comparisonData.tomorrow.wind - $comparisonData.today.wind).toFixed(1)} km/h
              </span>
            </div>
          </div>
        </div>
      </div>
    {/if}
  {:else}
    <div>{$t.noForecastComparisonDataAvailable}</div>
  {/if}
</div> 