<script lang="ts">
export let hourlyData: { time: string; temperature: number }[] = [];

import { onMount } from 'svelte';

let width = 600;
let height = 120;
let margin = { top: 20, right: 20, bottom: 30, left: 40 };
let svgEl: SVGSVGElement;

// Find min/max for scaling
$: temps = hourlyData.map(d => d.temperature);
$: minTemp = Math.min(...temps);
$: maxTemp = Math.max(...temps);

// X scale: evenly spaced
$: xStep = (width - margin.left - margin.right) / (hourlyData.length - 1);

// Y scale: invert so higher temps are higher
function yScale(temp: number) {
  return margin.top + (maxTemp - temp) / (maxTemp - minTemp || 1) * (height - margin.top - margin.bottom);
}

// Scrub state
let scrubIdx: number | null = null;
let isDragging = false;

function handlePointerDown(e: PointerEvent) {
  isDragging = true;
  svgEl.setPointerCapture(e.pointerId);
  updateScrub(e);
}
function handlePointerMove(e: PointerEvent) {
  if (!isDragging) return;
  updateScrub(e);
}
function handlePointerUp(e: PointerEvent) {
  isDragging = false;
  svgEl.releasePointerCapture(e.pointerId);
}
function updateScrub(e: PointerEvent) {
  const rect = svgEl.getBoundingClientRect();
  const x = e.clientX - rect.left - margin.left;
  let idx = Math.round(x / xStep);
  idx = Math.max(0, Math.min(hourlyData.length - 1, idx));
  scrubIdx = idx;
}
function handleLeave() {
  if (!isDragging) scrubIdx = null;
}

onMount(() => {
  // Keyboard accessibility: left/right arrows
  svgEl.addEventListener('keydown', (e: KeyboardEvent) => {
    if (scrubIdx === null) scrubIdx = 0;
    if (e.key === 'ArrowLeft') scrubIdx = Math.max(0, (scrubIdx ?? 0) - 1);
    if (e.key === 'ArrowRight') scrubIdx = Math.min(hourlyData.length - 1, (scrubIdx ?? 0) + 1);
  });
});
</script>

<div class="drag-scrub-graph" tabindex="0" aria-label="Hourly temperature graph" style="outline:none;">
  <svg
    bind:this={svgEl}
    width={width}
    height={height}
    tabindex="0"
    on:pointerdown={handlePointerDown}
    on:pointermove={handlePointerMove}
    on:pointerup={handlePointerUp}
    on:pointerleave={handleLeave}
    style="touch-action: none; user-select: none;"
    role="presentation"
    aria-label="Temperature graph for next 24 hours"
  >
    <!-- Line -->
    <polyline
      fill="none"
      stroke="#2563eb"
      stroke-width="3"
      points={hourlyData.map((d, i) => `${margin.left + i * xStep},${yScale(d.temperature)}`).join(' ')}
    />
    <!-- Points -->
    {#each hourlyData as d, i}
      <circle
        cx={margin.left + i * xStep}
        cy={yScale(d.temperature)}
        r={scrubIdx === i ? 6 : 3}
        fill={scrubIdx === i ? '#2563eb' : '#fff'}
        stroke="#2563eb"
        stroke-width={scrubIdx === i ? 3 : 1}
        style="cursor:pointer"
        on:pointerdown={() => { scrubIdx = i; isDragging = true; }}
        on:mouseenter={() => { if (!isDragging) scrubIdx = i; }}
        on:mouseleave={() => { if (!isDragging) scrubIdx = null; }}
      />
    {/each}
    <!-- Scrub tooltip -->
    {#if scrubIdx !== null}
      <g>
        <rect
          x={margin.left + scrubIdx * xStep - 36}
          y={yScale(hourlyData[scrubIdx].temperature) - 38}
          width="72"
          height="28"
          rx="6"
          fill="#fff"
          stroke="#2563eb"
          stroke-width="1.5"
          opacity="0.95"
        />
        <text
          x={margin.left + scrubIdx * xStep}
          y={yScale(hourlyData[scrubIdx].temperature) - 20}
          text-anchor="middle"
          font-size="13"
          font-weight="bold"
          fill="#2563eb"
        >
          {Math.round(hourlyData[scrubIdx].temperature)}°C
        </text>
        <text
          x={margin.left + scrubIdx * xStep}
          y={yScale(hourlyData[scrubIdx].temperature) - 7}
          text-anchor="middle"
          font-size="11"
          fill="#555"
        >
          {new Date(hourlyData[scrubIdx].time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </text>
      </g>
    {/if}
    <!-- Y axis labels -->
    <text x="8" y={yScale(maxTemp) + 4} font-size="12" fill="#2563eb">{Math.round(maxTemp)}°</text>
    <text x="8" y={yScale(minTemp) + 4} font-size="12" fill="#2563eb">{Math.round(minTemp)}°</text>
  </svg>
</div>

<style>
.drag-scrub-graph {
  width: 100%;
  max-width: 640px;
  margin: 0 auto 1.5rem auto;
  outline: none;
}
svg:focus {
  outline: 2px solid #2563eb;
}
</style> 