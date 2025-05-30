import { describe, it, expect, beforeEach } from 'vitest';
import { suggestionFilterStore, toggleSuggestionCategory, type SuggestionFilterState } from './suggestionFilter';
import { tick } from 'svelte';

const initialState: SuggestionFilterState = {
  wardrobe: true,
  activities: true,
  food: true,
  exercises: true,
};

describe('suggestionFilterStore', () => {
  beforeEach(() => {
    suggestionFilterStore.set({ ...initialState });
  });

  it('toggles a category', async () => {
    let value: SuggestionFilterState = { ...initialState };
    const unsubscribe = suggestionFilterStore.subscribe((v) => (value = v));
    expect(value.wardrobe).toBe(true);
    toggleSuggestionCategory('wardrobe');
    await tick();
    expect(value.wardrobe).toBe(false);
    toggleSuggestionCategory('wardrobe');
    await tick();
    expect(value.wardrobe).toBe(true);
    unsubscribe();
  });
}); 