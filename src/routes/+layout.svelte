<script lang="ts">
  import '../app.css';
  import WeatherBackground from '../components/WeatherBackground.svelte';
  import DarkModeToggle from '../components/DarkModeToggle.svelte';
  import { weatherStore } from '../stores/weather';

  $: weather = $weatherStore.data;
</script>

<WeatherBackground {weather}>
  <!-- Dark Mode Toggle -->
  <div class="fixed top-4 right-4 z-50">
    <DarkModeToggle />
  </div>
  
  <main class="min-h-screen p-4 md:p-6 lg:p-8">
    <slot />
  </main>
</WeatherBackground> 