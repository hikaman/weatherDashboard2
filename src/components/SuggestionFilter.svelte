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