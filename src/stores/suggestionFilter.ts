import { writable } from 'svelte/store';

export type SuggestionCategory = 'wardrobe' | 'activities' | 'food' | 'exercises';

export interface SuggestionFilterState {
  wardrobe: boolean;
  activities: boolean;
  food: boolean;
  exercises: boolean;
}

const initialState: SuggestionFilterState = {
  wardrobe: true,
  activities: true,
  food: true,
  exercises: true,
};

export const suggestionFilterStore = writable<SuggestionFilterState>(initialState);

export function toggleSuggestionCategory(category: SuggestionCategory) {
  suggestionFilterStore.update((state) => ({
    ...state,
    [category]: !state[category],
  }));
} 