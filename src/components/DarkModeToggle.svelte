<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  let isDark = false;

  onMount(() => {
    if (browser) {
      // Check for saved theme preference or default to system preference
      const savedTheme = localStorage.getItem('theme');
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      isDark = savedTheme === 'dark' || (!savedTheme && systemPrefersDark);
      updateTheme();
    }
  });

  function toggleDarkMode() {
    isDark = !isDark;
    updateTheme();
    if (browser) {
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      localStorage.setItem('themeOverride', 'true'); // User override
    }
  }

  // Allow user to clear override (double-click or long-press)
  function clearOverride() {
    if (browser) {
      localStorage.removeItem('themeOverride');
    }
  }

  function updateTheme() {
    if (browser) {
      if (isDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }
</script>

<button
  on:click={toggleDarkMode}
  on:dblclick={clearOverride}
  class="glass-button p-3 rounded-glass hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 backdrop-blur-glass"
  aria-label="Toggle dark mode"
  title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
>
  {#if isDark}
    <!-- Sun icon for light mode -->
    <svg class="w-5 h-5 text-glass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"></path>
    </svg>
  {:else}
    <!-- Moon icon for dark mode -->
    <svg class="w-5 h-5 text-glass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path>
    </svg>
  {/if}
</button> 