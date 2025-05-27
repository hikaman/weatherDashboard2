<script lang="ts">
  import { suggestionFilterStore, toggleSuggestionCategory, type SuggestionCategory } from '../stores/suggestionFilter';
  import { get } from 'svelte/store';

  const categories: { key: SuggestionCategory; label: string; icon: string }[] = [
    { key: 'wardrobe', label: 'Wardrobe', icon: '👗' },
    { key: 'activities', label: 'Activities', icon: '🏃' },
    { key: 'food', label: 'Food', icon: '🍲' },
    { key: 'exercises', label: 'Exercises', icon: '💪' },
  ];

  $: filter = $suggestionFilterStore;
</script>

<div class="flex gap-4 items-center mb-4">
  {#each categories as { key, label, icon } }
    <button
      type="button"
      class="flex items-center gap-2 px-3 py-2 rounded-full glass-card border border-glass-light-border dark:border-glass-dark-border focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-200"
      aria-pressed={filter[key]}
      on:click={() => toggleSuggestionCategory(key)}
      aria-label={`Toggle ${label}`}
    >
      <span class="text-xl">{icon}</span>
      <span class="font-medium">{label}</span>
      <span class="ml-2 w-3 h-3 rounded-full" style="background:{filter[key] ? '#38bdf8' : '#cbd5e1'}"></span>
    </button>
  {/each}
</div>

<style>
  button[aria-pressed="true"] {
    background: rgba(56, 189, 248, 0.15);
    border-color: #38bdf8;
  }
  button:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 2px;
    box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
  }
</style> 