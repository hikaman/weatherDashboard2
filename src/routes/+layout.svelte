<script lang="ts">
  import '../app.css';
  import WeatherBackground from '../components/WeatherBackground.svelte';
  import { weatherStore } from '../stores/weather';

  $: weather = $weatherStore.data;
</script>

<WeatherBackground {weather}>
  <main class="min-h-screen p-4 md:p-6 lg:p-8">
    <slot />
  </main>
</WeatherBackground> 