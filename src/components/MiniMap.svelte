<script lang="ts">
import { onMount, createEventDispatcher } from 'svelte';
import { lastCityStore } from '../stores/lastCity';
import { get } from 'svelte/store';

const dispatch = createEventDispatcher();
let mapContainer: HTMLDivElement;
let map: any;
let marker: any;
let leafletLoaded = false;
let loading = true;

// Default location (London)
const DEFAULT = { name: 'London', latitude: 51.5074, longitude: -0.1278 };

let city = get(lastCityStore) || DEFAULT;

// Helper: reverse geocode using Open-Meteo
async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/reverse?latitude=${lat}&longitude=${lon}&count=1&language=en&format=json`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.results && data.results[0]) {
      return data.results[0].name;
    }
  } catch {}
  return `${lat.toFixed(2)}, ${lon.toFixed(2)}`;
}

async function loadLeaflet() {
  if (typeof window === 'undefined') return null;
  const L = await import('leaflet');
  if (!document.querySelector('link[href*="leaflet.css"]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
    document.head.appendChild(link);
  }
  leafletLoaded = true;
  return L.default || L;
}

async function initializeMap() {
  const L = await loadLeaflet();
  if (!L || !mapContainer) return;
  map = L.map(mapContainer, { zoomControl: false, attributionControl: false }).setView([city.latitude, city.longitude], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    minZoom: 2,
    maxZoom: 12
  }).addTo(map);
  marker = L.marker([city.latitude, city.longitude]).addTo(map);
  loading = false;

  // Click to select new city
  map.on('click', async (e: any) => {
    const { lat, lng } = e.latlng;
    marker.setLatLng([lat, lng]);
    const name = await reverseGeocode(lat, lng);
    dispatch('citySelect', { name, latitude: lat, longitude: lng });
  });
}

onMount(async () => {
  city = get(lastCityStore) || DEFAULT;
  await initializeMap();
});
</script>

<div class="mini-map-container" aria-label="Mini map for quick city selection" tabindex="0">
  {#if loading}
    <div class="flex items-center justify-center h-32">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  {:else}
    <div bind:this={mapContainer} class="mini-map" style="height: 140px; width: 100%; border-radius: 1rem; overflow: hidden;"></div>
  {/if}
</div>

<style>
.mini-map-container {
  width: 100%;
  outline: none;
}
.mini-map:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
}
</style> 