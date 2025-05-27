<script lang="ts">
import { weatherStore } from '../stores/weather';
import { derived } from 'svelte/store';
import { t } from '../lib/i18n';

// Helper to parse ISO time and get minutes since midnight
function getMinutes(timeStr: string) {
  const d = new Date(timeStr);
  return d.getHours() * 60 + d.getMinutes();
}

// Get today's sunrise/sunset from weatherStore
const sunTimes = derived(weatherStore, ($ws) => {
  const daily = $ws.data?.daily;
  if (!daily) return null;
  const todayIdx = daily.time.findIndex((d) => d === new Date().toISOString().slice(0, 10));
  if (todayIdx === -1) return null;
  return {
    sunrise: daily.sunrise[todayIdx],
    sunset: daily.sunset[todayIdx],
  };
});

// Golden hour = 1 hour after sunrise, 1 hour before sunset
function getArcAngles(sunrise: string, sunset: string) {
  const sunriseMin = getMinutes(sunrise);
  const sunsetMin = getMinutes(sunset);
  return {
    sunriseStart: sunriseMin,
    sunriseEnd: sunriseMin + 60,
    sunsetStart: sunsetMin - 60,
    sunsetEnd: sunsetMin,
  };
}

// SVG helpers
const R = 48, C = 60, STROKE = 10, FULL = 1440; // 24*60
function polarToXY(min: number) {
  const angle = ((min / FULL) * 360 - 90) * (Math.PI / 180);
  return {
    x: C + R * Math.cos(angle),
    y: C + R * Math.sin(angle),
  };
}
function describeArc(start: number, end: number) {
  const s = polarToXY(start), e = polarToXY(end);
  const large = end - start > 720 ? 1 : 0;
  return `M${s.x},${s.y} A${R},${R} 0 ${large} 1 ${e.x},${e.y}`;
}

$: now = new Date();
$: nowMin = now.getHours() * 60 + now.getMinutes();
$: $sunTimes;
$: arc = $sunTimes ? getArcAngles($sunTimes.sunrise, $sunTimes.sunset) : null;

</script>

<div class="sunring glass-card-lg p-4 flex flex-col items-center justify-center mb-6" aria-label="Sunrise, Sunset, and Golden Hour">
  {#if $sunTimes && arc}
    <svg width="120" height="120" viewBox="0 0 120 120" class="block mb-2">
      <!-- Full day ring -->
      <circle cx="60" cy="60" r="48" fill="none" stroke="#e0e7ef" stroke-width="10" />
      <!-- Golden hour after sunrise -->
      <path d={describeArc(arc.sunriseStart, arc.sunriseEnd)} stroke="#FFD700" stroke-width="10" fill="none" />
      <!-- Golden hour before sunset -->
      <path d={describeArc(arc.sunsetStart, arc.sunsetEnd)} stroke="#FFD700" stroke-width="10" fill="none" />
      <!-- Current time marker -->
      <circle {...polarToXY(nowMin)} r="6" fill="#2563eb" stroke="#fff" stroke-width="2" />
    </svg>
    <div class="flex gap-6 text-glass-secondary text-sm">
      <div class="flex items-center gap-1">
        <span aria-label="Sunrise">🌅</span>
        <span>{new Date($sunTimes.sunrise).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
      <div class="flex items-center gap-1">
        <span aria-label="Sunset">🌇</span>
        <span>{new Date($sunTimes.sunset).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </div>
  {:else}
    <div class="text-glass-secondary text-sm">Loading sunrise and sunset times...</div>
  {/if}
</div>

<style>
.sunring {
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(30,144,255,0.08);
  max-width: 320px;
}
svg {
  display: block;
}
</style> 