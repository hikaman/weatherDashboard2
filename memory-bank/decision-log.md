# Decision Log

## 1. Last Searched City Persistence
- Decided to use a dedicated Svelte store (`lastCityStore`) synced with localStorage for robust, type-safe persistence.
- Store is updated on city search and restored on app load, ensuring seamless user experience.

## 2. Weather Data Cache for Offline Support
- Chose to cache the latest weather data in localStorage after each successful fetch.
- On offline, the app loads from cache and shows a fallback UI, prioritizing reliability and user trust.

## 3. Suggestion Filter/Toggle Component
- Implemented a Svelte store to track enabled suggestion categories and a UI component for toggling.
- This approach allows for instant, reactive filtering and is easily extensible for future categories.

## 4. Animated Weather Icons
- Opted for a custom Svelte component using animated SVGs for weather icons, mapped by weather code.
- This ensures smooth, performant, and visually appealing icons without external dependencies. 