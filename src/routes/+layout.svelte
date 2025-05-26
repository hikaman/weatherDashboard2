<script lang="ts">
  import '../app.css';
  import WeatherBackground from '../components/WeatherBackground.svelte';
  import DarkModeToggle from '../components/DarkModeToggle.svelte';
  import LanguageToggle from '../components/LanguageToggle.svelte';
  import { weatherStore } from '../stores/weather';
  import { initLocale } from '../lib/i18n';
  import { onMount } from 'svelte';

  $: weather = $weatherStore.data;

  onMount(() => {
    initLocale();
  });
</script>

<WeatherBackground {weather}>
  <!-- Controls -->
  <div class="fixed top-4 right-4 z-50 flex gap-2">
    <LanguageToggle />
    <DarkModeToggle />
  </div>
  
  <main class="min-h-screen p-4 md:p-6 lg:p-8">
    <slot />
  </main>
</WeatherBackground> 