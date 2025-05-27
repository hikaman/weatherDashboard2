<script lang="ts">
import { createEventDispatcher, onMount, onDestroy } from 'svelte';
import CitySearch from './CitySearch.svelte';
import { lastCityStore } from '../stores/lastCity';
import { writable } from 'svelte/store';

export let open = false;
const dispatch = createEventDispatcher();

let sheetRef: HTMLDivElement | null = null;
let lastFocused: HTMLElement | null = null;
let startY = 0;
let currentY = 0;
let dragging = false;
let translateY = 0;

const recentCities = writable<{name: string}[]>([]);

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

onMount(() => {
  if (open) {
    lastFocused = document.activeElement as HTMLElement;
    setTimeout(() => sheetRef?.focus(), 0);
    window.addEventListener('keydown', handleKeydown);
  }
  // Load recent cities from localStorage
  const recents = JSON.parse(localStorage.getItem('recentCities') || '[]');
  recentCities.set(recents);
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
  <div class="bsqs-backdrop" tabindex="-1" on:click={() => close()}></div>
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
    <div class="bsqs-handle" aria-label="Drag to close"></div>
    <button class="bsqs-close" aria-label="Close quick search" on:click={close}>&times;</button>
    <div class="bsqs-content">
      <h2 class="text-lg font-bold mb-2">Quick City Search</h2>
      <CitySearch />
      <div class="mt-4">
        <h3 class="text-sm font-semibold mb-1">Recent Cities</h3>
        <ul class="flex flex-wrap gap-2">
          {#each $recentCities as city}
            <li class="recent-chip">{city.name}</li>
          {/each}
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