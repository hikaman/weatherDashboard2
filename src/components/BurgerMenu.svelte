<script lang="ts">
import { t } from '../lib/i18n';
import CitySearch from './CitySearch.svelte';
import LanguageToggle from './LanguageToggle.svelte';
import DarkModeToggle from './DarkModeToggle.svelte';
import { onMount, onDestroy } from 'svelte';

let open = false;
let menuRef: HTMLDivElement;

function toggleMenu() {
  open = !open;
}

let handle: ((e: MouseEvent) => void) | null = null;

$: {
  if (open && menuRef) {
    handle = (e: MouseEvent) => {
      if (!menuRef.contains(e.target as Node)) open = false;
    };
    window.addEventListener('mousedown', handle);
  } else if (handle) {
    window.removeEventListener('mousedown', handle);
    handle = null;
  }
}

onDestroy(() => {
  if (handle) window.removeEventListener('mousedown', handle);
});
</script>

<div class="relative z-50 burger-menu-z">
  <button class="burger-btn" aria-label="{$t.openMenu}" on:click={toggleMenu}>
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
      <line x1="8" y1="10" x2="24" y2="10" />
      <line x1="8" y1="16" x2="24" y2="16" />
      <line x1="8" y1="22" x2="24" y2="22" />
    </svg>
  </button>
  {#if open}
    <div bind:this={menuRef} class="dropdown transparent-menu absolute right-0 mt-3 w-72 p-0 flex flex-col gap-0 shadow-none border-none" tabindex="-1">
      <div class="p-5 pb-2"><CitySearch /></div>
      <div class="toggle-row flex flex-row gap-1 px-5 pb-4 justify-start items-center">
        <LanguageToggle />
        <DarkModeToggle />
      </div>
    </div>
  {/if}
</div>

<style>
.burger-btn {
  width: 2.88rem;
  height: 2.88rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  border: 1.5px solid #2563eb;
  background: #2563eb;
  box-shadow: 0 6px 24px 0 rgba(56,189,248,0.10), 0 1.5px 6px 0 rgba(30,64,175,0.08);
  backdrop-filter: blur(10px);
  transition: background 0.2s, box-shadow 0.2s, border 0.2s;
  color: #fff;
  transform: scale(0.9);
}
.burger-btn:hover, .burger-btn:focus {
  background: #1746a2;
  border: 1.5px solid #1746a2;
  box-shadow: 0 0 0 4px rgba(37,99,235,0.18), 0 6px 24px 0 rgba(56,189,248,0.13);
  outline: none;
}
.burger-btn svg {
  width: 28.8px;
  height: 28.8px;
  stroke: #fff;
}
.glassy {
  background: rgba(255,255,255,0.22);
  backdrop-filter: blur(10px);
}
.transparent-menu {
  background: transparent !important;
  box-shadow: none !important;
  border: none !important;
}
.toggle-row > * {
  transform: scale(0.7);
  min-width: 0;
  min-height: 0;
}
.toggle-row button, .toggle-row .glass-button {
  font-size: 0.85rem !important;
  padding: 0.1rem 0.3rem !important;
  min-width: 0 !important;
  min-height: 0 !important;
}
.burger-menu-z {
  z-index: 1000 !important;
}
</style> 