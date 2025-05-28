<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from 'svelte';
import CitySearch from './CitySearch.svelte';
import { lastCityStore } from '../stores/lastCity';
import { writable } from 'svelte/store';
import MiniMap from './MiniMap.svelte';
import { fetchWeatherData, type GeocodingResult } from '../stores/weather';
import { t } from '../lib/i18n';

export let open = false;
const dispatch = createEventDispatcher();

let sheetRef: HTMLDivElement | null = null;
let lastFocused: HTMLElement | null = null;
let startY = 0;
let currentY = 0;
let dragging = false;
let translateY = 0;

const FAVORITE_CITIES_KEY = 'favoriteCities';
const RECENT_CITIES_KEY = 'recentCities';

const favoriteCities = writable<GeocodingResult[]>([]);
const recentCities = writable<GeocodingResult[]>([]);

function close() {
  dispatch('close');
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') close();
  // Focus trap
  if (e.key === 'Tab' && sheetRef) {
    const focusable = sheetRef.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    } else if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    }
  }
}

function handleTouchStart(e: TouchEvent) {
  dragging = true;
  startY = e.touches[0].clientY;
}
function handleTouchMove(e: TouchEvent) {
  if (!dragging) return;
  currentY = e.touches[0].clientY;
  translateY = Math.max(0, currentY - startY);
}
function handleTouchEnd() {
  dragging = false;
  if (translateY > 80) close();
  translateY = 0;
}

// Helper: Load from localStorage
function loadCities(key: string): GeocodingResult[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) return arr;
    return [];
  } catch { return []; }
}
// Helper: Save to localStorage
function saveCities(key: string, cities: GeocodingResult[]) {
  try { localStorage.setItem(key, JSON.stringify(cities)); } catch {}
}

// Add to recents (most recent first, unique by lat/lon)
function addRecent(city: GeocodingResult) {
  let recents = loadCities(RECENT_CITIES_KEY);
  recents = [city, ...recents.filter(c => c.latitude !== city.latitude || c.longitude !== city.longitude)];
  recents = recents.slice(0, 8); // max 8
  saveCities(RECENT_CITIES_KEY, recents);
  recentCities.set(recents);
}
// Add/remove favorite
function toggleFavorite(city: GeocodingResult) {
  let favs = loadCities(FAVORITE_CITIES_KEY);
  const exists = favs.some(c => c.latitude === city.latitude && c.longitude === city.longitude);
  if (exists) {
    favs = favs.filter(c => c.latitude !== city.latitude || c.longitude !== city.longitude);
  } else {
    favs = [city, ...favs];
  }
  saveCities(FAVORITE_CITIES_KEY, favs);
  favoriteCities.set(favs);
}
function isFavorite(city: GeocodingResult) {
  return $favoriteCities.some(c => c.latitude === city.latitude && c.longitude === city.longitude);
}

// Select city (from any source)
async function selectCity(city: GeocodingResult) {
  await fetchWeatherData(city.latitude, city.longitude, city.name);
  addRecent(city);
  close();
}

onMount(() => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement;
    setTimeout(() => sheetRef?.focus(), 0);
    window.addEventListener('keydown', handleKeydown);
  }
  favoriteCities.set(loadCities(FAVORITE_CITIES_KEY));
  recentCities.set(loadCities(RECENT_CITIES_KEY));
});
onDestroy(() => {
  window.removeEventListener('keydown', handleKeydown);
  if (lastFocused) lastFocused.focus();
});
$: if (open && sheetRef) {
  setTimeout(() => sheetRef?.focus(), 0);
}
</script>

{#if open}
  <button class="bsqs-backdrop" aria-label="{$t.closeQuickSearch}" on:click={close} on:keydown={(e) => (e.key === 'Enter' || e.key === ' ' ? close() : undefined)} tabindex="0"></button>
  <div
    class="bsqs-sheet glass-card-lg"
    tabindex="0"
    bind:this={sheetRef}
    role="dialog"
    aria-modal="true"
    style="transform: translateY({dragging ? translateY : 0}px);"
    on:click|stopPropagation
    on:touchstart={handleTouchStart}
    on:touchmove={handleTouchMove}
    on:touchend={handleTouchEnd}
  >
    <div class="bsqs-handle" aria-label="{$t.dragToClose}"></div>
    <button class="bsqs-close" aria-label="{$t.closeQuickSearch}" on:click={close}>&times;</button>
    <div class="bsqs-content">
      <h2 class="text-lg font-bold mb-2">Quick City Search</h2>
      <!-- Mini Map -->
      <div class="mb-4">
        <MiniMap on:citySelect={e => selectCity(e.detail)} />
      </div>
      <!-- City Search -->
      <CitySearch on:select={e => selectCity(e.detail)} />
      <!-- Favorites -->
      <div class="mt-4">
        <h3 class="text-sm font-semibold mb-1">Favorite Cities</h3>
        <ul class="flex flex-wrap gap-2">
          {#each $favoriteCities as city}
            <button class="recent-chip flex items-center" aria-label={`Select favorite city ${city.name}`} on:click={() => selectCity(city)}>
              <span>{city.name}</span>
              <span
                class="ml-1 text-yellow-400 cursor-pointer"
                role="img"
                aria-label="{$t.unfavoriteCity}"
                tabindex="0"
                on:click|stopPropagation={() => toggleFavorite(city)}
                on:keydown|stopPropagation={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFavorite(city)}
              >&#9733;<span class="sr-only">Unfavorite</span></span>
            </button>
          {/each}
          {#if !$favoriteCities.length}
            <li class="text-xs text-glass-secondary">No favorites yet</li>
          {/if}
        </ul>
      </div>
      <!-- Recents -->
      <div class="mt-4">
        <h3 class="text-sm font-semibold mb-1">Recent Cities</h3>
        <ul class="flex flex-wrap gap-2">
          {#each $recentCities as city}
            <button class="recent-chip flex items-center" aria-label={`Select recent city ${city.name}`} on:click={() => selectCity(city)}>
              <span>{city.name}</span>
              <span
                class="ml-1 text-yellow-400 opacity-60 hover:opacity-100 cursor-pointer"
                role="img"
                aria-label={isFavorite(city) ? 'Unfavorite city' : 'Favorite city'}
                tabindex="0"
                on:click|stopPropagation={() => toggleFavorite(city)}
                on:keydown|stopPropagation={(e) => (e.key === 'Enter' || e.key === ' ') && toggleFavorite(city)}
              >{isFavorite(city) ? '★' : '☆'}<span class="sr-only">{isFavorite(city) ? 'Unfavorite' : 'Favorite'}</span></span>
            </button>
          {/each}
          {#if !$recentCities.length}
            <li class="text-xs text-glass-secondary">No recent cities</li>
          {/if}
        </ul>
      </div>
    </div>
  </div>
{/if}

<style>
.bsqs-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(30, 41, 59, 0.25);
  backdrop-filter: blur(8px);
  z-index: 50;
}
.bsqs-sheet {
  position: fixed;
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 100%);
  min-width: 320px;
  max-width: 100vw;
  min-height: 180px;
  max-height: 80vh;
  background: rgba(255,255,255,0.25);
  border-radius: 1.5rem 1.5rem 0 0;
  box-shadow: 0 -8px 32px 0 rgba(31, 38, 135, 0.37);
  backdrop-filter: blur(24px) saturate(180%);
  -webkit-backdrop-filter: blur(24px) saturate(180%);
  border: 1px solid rgba(255,255,255,0.18);
  z-index: 100;
  outline: none;
  padding: 0;
  display: flex;
  flex-direction: column;
  animation: bsqs-in 0.25s cubic-bezier(0.4,0,0.2,1);
}
@keyframes bsqs-in {
  from { transform: translate(-50%, 100%) scale(0.98); opacity: 0; }
  to { transform: translate(-50%, 0) scale(1); opacity: 1; }
}
.bsqs-handle {
  width: 48px;
  height: 6px;
  background: rgba(120,120,120,0.25);
  border-radius: 3px;
  margin: 0.75rem auto 0.5rem auto;
  cursor: grab;
}
.bsqs-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: rgba(255,255,255,0.4);
  border: none;
  border-radius: 50%;
  width: 2.5rem;
  height: 2.5rem;
  font-size: 2rem;
  color: #334155;
  cursor: pointer;
  transition: background 0.2s;
  z-index: 10;
}
.bsqs-close:hover {
  background: rgba(255,255,255,0.7);
}
.bsqs-content {
  padding: 1.5rem 1.5rem 1.5rem 1.5rem;
  overflow-y: auto;
  flex: 1;
}
.recent-chip {
  background: rgba(30,144,255,0.08);
  color: #334155;
  border-radius: 9999px;
  padding: 0.25rem 0.75rem;
  font-size: 0.95em;
  font-weight: 500;
  box-shadow: 0 1px 4px rgba(30,144,255,0.04);
}
@media (max-width: 640px) {
  .bsqs-sheet {
    min-width: 0;
    width: 100vw;
    border-radius: 1.25rem 1.25rem 0 0;
  }
}
</style> 