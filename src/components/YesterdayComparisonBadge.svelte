<script lang="ts">
import { weatherStore } from '../stores/weather';
import { derived } from 'svelte/store';
import { t } from '../lib/i18n';
import { get } from 'svelte/store';

const comparison = derived(weatherStore, ($ws) => {
  const daily = $ws.data?.daily;
  if (!daily) return null;
  const todayStr = new Date().toISOString().slice(0, 10);
  const idxToday = daily.time.findIndex((d) => d === todayStr);
  if (idxToday <= 0) return null;
  const idxYesterday = idxToday - 1;
  return {
    tempMaxToday: daily.temperature_2m_max[idxToday],
    tempMaxYesterday: daily.temperature_2m_max[idxYesterday],
    tempMinToday: daily.temperature_2m_min[idxToday],
    tempMinYesterday: daily.temperature_2m_min[idxYesterday],
    precipToday: daily.precipitation_sum[idxToday],
    precipYesterday: daily.precipitation_sum[idxYesterday],
  };
});

function getSummary(c: {
  tempMaxToday: number;
  tempMaxYesterday: number;
  tempMinToday: number;
  tempMinYesterday: number;
  precipToday: number;
  precipYesterday: number;
} | null) {
  if (!c) return null;
  const tempDelta = c.tempMaxToday - c.tempMaxYesterday;
  const precipDelta = c.precipToday - c.precipYesterday;
  let msg = '', icon = '', color = '';
  if (Math.abs(tempDelta) >= 1) {
    if (tempDelta > 0) { icon = '🔥'; color = 'bg-orange-100 text-orange-800'; msg = `${get(t).warmerThanYesterday} +${tempDelta.toFixed(1)}°C`; }
    else { icon = '❄️'; color = 'bg-blue-100 text-blue-800'; msg = `${get(t).colderThanYesterday} ${tempDelta.toFixed(1)}°C`; }
  }
  if (Math.abs(precipDelta) >= 1) {
    if (precipDelta > 0) { icon = '💧'; color = 'bg-blue-100 text-blue-800'; msg = `${get(t).wetterThanYesterday} +${precipDelta.toFixed(1)}mm`; }
    else { icon = '🌤️'; color = 'bg-yellow-100 text-yellow-800'; msg = `${get(t).drierThanYesterday} ${precipDelta.toFixed(1)}mm`; }
  }
  if (!msg) { icon = '⚖️'; color = 'bg-gray-100 text-gray-800'; msg = get(t).similarToYesterday; }
  return { icon, color, msg };
}

$: c = $comparison;
$: summary = getSummary(c);
</script>

{#if summary}
  <div class={`yesterday-badge chip ${summary.color}`} aria-label="Yesterday comparison badge">
    <span class="icon">{summary.icon}</span>
    <span class="label">{summary.msg}</span>
  </div>
{/if}

<style>
.yesterday-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.5em;
  border-radius: 9999px;
  padding: 0.3em 1em;
  font-weight: 600;
  font-size: 1em;
  box-shadow: 0 1px 4px rgba(30,144,255,0.08);
  margin-left: auto;
}
.icon {
  font-size: 1.2em;
}
.label {
  font-size: 0.98em;
}
</style> 