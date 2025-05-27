<script lang="ts">
import { weatherStore } from '../stores/weather';
import { airQualityStore } from '../stores/airQuality';
import { t } from '../lib/i18n';

// Helper for UV risk color
function getUVColor(uv: number) {
  if (uv < 3) return 'bg-green-200 text-green-900';
  if (uv < 6) return 'bg-yellow-200 text-yellow-900';
  if (uv < 8) return 'bg-orange-200 text-orange-900';
  if (uv < 11) return 'bg-red-200 text-red-900';
  return 'bg-purple-200 text-purple-900';
}

// Helper for AQI color (European scale)
function getAQIColor(aqi: number) {
  if (aqi <= 20) return 'bg-green-200 text-green-900';
  if (aqi <= 40) return 'bg-yellow-200 text-yellow-900';
  if (aqi <= 60) return 'bg-orange-200 text-orange-900';
  if (aqi <= 80) return 'bg-red-200 text-red-900';
  if (aqi <= 100) return 'bg-purple-200 text-purple-900';
  return 'bg-gray-300 text-gray-900';
}

$: currentWeather = $weatherStore.data?.current;
$: airQuality = $airQualityStore.data;
$: airQualityError = $airQualityStore.error;
</script>

<div class="uv-aq-strip flex flex-wrap gap-3 items-center justify-center glass-card-lg p-3 mb-6" aria-label="UV and Air Quality">
  {#if currentWeather && airQuality}
    <!-- UV Index -->
    <div class={`chip ${getUVColor(currentWeather.uv_index)}`} aria-label="UV Index">
      <span class="icon">☀️</span>
      <span class="label">UV</span>
      <span class="value">{currentWeather.uv_index.toFixed(1)}</span>
    </div>
    <!-- European AQI -->
    <div class={`chip ${getAQIColor(airQuality.european_aqi)}`} aria-label="European AQI">
      <span class="icon">🌫️</span>
      <span class="label">EU AQI</span>
      <span class="value">{airQuality.european_aqi}</span>
    </div>
    <!-- US AQI -->
    <div class={`chip ${getAQIColor(airQuality.us_aqi)}`} aria-label="US AQI">
      <span class="icon">🇺🇸</span>
      <span class="label">US AQI</span>
      <span class="value">{airQuality.us_aqi}</span>
    </div>
    <!-- PM2.5 -->
    <div class="chip bg-blue-100 text-blue-900" aria-label="PM2.5">
      <span class="icon">🟤</span>
      <span class="label">PM2.5</span>
      <span class="value">{airQuality.pm2_5} μg/m³</span>
    </div>
    <!-- PM10 -->
    <div class="chip bg-blue-50 text-blue-900" aria-label="PM10">
      <span class="icon">⚪</span>
      <span class="label">PM10</span>
      <span class="value">{airQuality.pm10} μg/m³</span>
    </div>
    <!-- NO2 -->
    <div class="chip bg-yellow-50 text-yellow-900" aria-label="NO2">
      <span class="icon">🟡</span>
      <span class="label">NO₂</span>
      <span class="value">{airQuality.no2} μg/m³</span>
    </div>
    <!-- O3 -->
    <div class="chip bg-green-50 text-green-900" aria-label="Ozone">
      <span class="icon">🟢</span>
      <span class="label">O₃</span>
      <span class="value">{airQuality.o3} μg/m³</span>
    </div>
  {:else if airQualityError}
    <div class="text-red-500 text-sm">{airQualityError}</div>
  {:else}
    <div class="text-glass-secondary text-sm">Loading UV and air quality data...</div>
  {/if}
</div>

<style>
.uv-aq-strip {
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(30,144,255,0.08);
  overflow-x: auto;
}
.chip {
  display: flex;
  align-items: center;
  gap: 0.5em;
  border-radius: 9999px;
  padding: 0.4em 1.1em;
  font-weight: 600;
  font-size: 1em;
  box-shadow: 0 1px 4px rgba(30,144,255,0.08);
  min-width: 90px;
  justify-content: center;
}
.icon {
  font-size: 1.2em;
}
.label {
  font-size: 0.95em;
  opacity: 0.7;
}
.value {
  font-size: 1.1em;
  margin-left: 0.2em;
}
@media (max-width: 600px) {
  .uv-aq-strip {
    flex-direction: column;
    gap: 0.5em;
    padding: 1em 0.5em;
  }
  .chip {
    min-width: 0;
    width: 100%;
    justify-content: flex-start;
  }
}
</style> 