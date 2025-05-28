<script lang="ts">
  import { alertsStore, type WeatherAlert } from '../stores/alerts';
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';
  import { t } from '../lib/i18n';
  
  const alerts = writable<WeatherAlert[]>([]);
  const unsubscribe = alertsStore.subscribe((a) => alerts.set(a));
  onDestroy(unsubscribe);
  
  function getColor(severity: string) {
    if (severity === 'danger') return 'bg-red-200 text-red-900';
    if (severity === 'warning') return 'bg-yellow-200 text-yellow-900';
    return 'bg-blue-100 text-blue-900';
  }
  
  function dismiss(idx: number) {
    alerts.update((a) => a.filter((_, i) => i !== idx));
  }
</script>

{#if $alerts.length > 0}
  <div class="weather-alerts flex flex-col gap-2 mb-4" aria-live="polite">
    {#each $alerts as alert, idx}
      <div class={`alert-chip ${getColor(alert.severity)} flex items-center gap-3 px-4 py-2 rounded-lg shadow`} role="alert">
        <span class="font-bold">{alert.message}</span>
        <button class="ml-auto text-lg px-2 py-1 rounded hover:bg-white/30 focus:outline-none" aria-label="{$t.dismissAlert}" on:click={() => dismiss(idx)}>&times;</button>
      </div>
    {/each}
  </div>
{/if}

<style>
.weather-alerts {
  z-index: 50;
}
.alert-chip {
  transition: background 0.2s;
  }
</style> 