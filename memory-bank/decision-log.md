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

## 5. Glassmorphic Modals/Sidebars
- Created a reusable, accessible modal component with glassmorphism (blur, transparency, rounded corners).
- Modal supports keyboard navigation, focus trap, and ESC to close, ensuring accessibility and modern design.

## 6. Accessibility & Responsiveness Audit
- Added visible focus states, aria-live regions, and keyboard navigation to all major interactive elements.
- Improved color contrast and ensured all layouts are responsive for mobile, tablet, and desktop.
- Prioritized WCAG compliance and screen reader compatibility for all user-facing features.

## 7. Vitest Tests for Stores/Utils
- 2024-XX-XX: Feature 7 (Vitest tests for stores/utils):
    - Issue: `suggestionFilterStore` test failed because the store subscription was immediately unsubscribed, so updates were not observed.
    - Decision: Keep the subscription active for the duration of the test and unsubscribe at the end.
    - Result: Test now passes. All store and util tests pass. Svelte component tests remain blocked by Svelte 5/Vitest compatibility.

## 8. Forecast Comparison Box
- Decided to use Open-Meteo's `past_days=1` parameter to fetch yesterday's data along with today and tomorrow.
- Implemented ForecastComparisonBox.svelte to display and highlight changes in key metrics (temperature, precipitation, wind) between days.

## 9. City Search Input UI Improvements
- Made the city search input smaller and more compact for a cleaner look.
- Placed the city search input beside the language toggle for a unified top-row control.
- Moved the current location display to the today card in WeatherDisplay for better clarity and visibility.

## 10. Feels‐Like vs. Actual Delta Chip
- Added 'apparent_temperature' to the Open-Meteo API call and CurrentWeather type.
- The current weather card now shows a Feels-Like vs. Actual Delta Chip, with color and icon to indicate if it feels warmer or colder than the actual temperature.

## 11. UV & Air-Quality Strip
- Decided to fetch UV index with the main weather API call and air quality data (AQI, PM2.5, PM10, NO2, O3) from Open-Meteo's air-quality API.
- Implemented UVAirQualityStrip.svelte to show a color-coded strip with UV, AQI, and pollutant chips below the weather card for quick risk assessment.

## 12. Sunrise / Sunset & Golden-Hour Ring
- Added 'sunrise' and 'sunset' to the daily weather API call and DailyWeather type.
- Implemented SunriseSunsetRing.svelte to show a ring with sunrise, sunset, current time, and golden hour arcs below the weather card using SVG. 