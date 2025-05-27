<script lang="ts">
  import '../app.css';
  import WeatherBackground from '../components/WeatherBackground.svelte';
  import DarkModeToggle from '../components/DarkModeToggle.svelte';
  import LanguageToggle from '../components/LanguageToggle.svelte';
  import { weatherStore } from '../stores/weather';
  import { initLocale } from '../lib/i18n';
  import { onMount } from 'svelte';
  import BottomSheetQuickSearch from '../components/BottomSheetQuickSearch.svelte';

  $: weather = $weatherStore.data;

  let showControls = true;
  let lastScrollY = 0;
  let showQuickSearch = false;

  function handleScroll() {
    const currentY = window.scrollY;
    if (currentY < 10) {
      showControls = true;
    } else if (currentY > lastScrollY) {
      showControls = false; // scrolling down
    } else {
      showControls = true; // scrolling up
    }
    lastScrollY = currentY;
  }

  onMount(() => {
    initLocale();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  });
</script>

<WeatherBackground {weather}>
  <!-- Controls -->
  <div class="fixed top-4 right-4 z-50 flex gap-2 transition-all duration-300"
    style="transform: translateY({showControls ? '0' : '-60'}px); opacity: {showControls ? 1 : 0}; pointer-events: {showControls ? 'auto' : 'none'};"
    aria-live="polite"
  >
    <LanguageToggle />
    <DarkModeToggle />
  </div>
  
  <!-- FAB for Quick Search -->
  {#if !showQuickSearch}
    <button
      class="fab-search"
      aria-label="Open quick city search"
      on:click={() => showQuickSearch = true}
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    </button>
  {/if}

  <BottomSheetQuickSearch open={showQuickSearch} on:close={() => showQuickSearch = false} />

  <main class="min-h-screen p-4 md:p-6 lg:p-8">
    <slot />
  </main>
</WeatherBackground>

<style>
.fab-search {
  position: fixed;
  bottom: 2.5rem;
  right: 2.5rem;
  z-index: 60;
  width: 3.5rem;
  height: 3.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #38bdf8 60%, #6366f1 100%);
  color: #fff;
  box-shadow: 0 4px 16px rgba(56,189,248,0.18);
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.7rem;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s, transform 0.15s;
}
.fab-search:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
}
.fab-search:hover {
  background: linear-gradient(135deg, #6366f1 60%, #38bdf8 100%);
  transform: scale(1.07);
}
@media (max-width: 640px) {
  .fab-search {
    right: 1.2rem;
    bottom: 1.2rem;
    width: 3rem;
    height: 3rem;
    font-size: 1.3rem;
  }
}
</style> 