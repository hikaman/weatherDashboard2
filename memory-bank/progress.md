# Progress

> **Note:** For a high-level summary of the codebase structure, conventions, and recommendations, see [docs/codebase-summary.md](../docs/codebase-summary.md). This summary is kept up to date with major project changes and informs ongoing progress tracking.

## What Works
- Real-time weather data and forecasts
- Unified, personalized suggestions for wardrobe, food, activity, and exercise
- Responsive, accessible UI with dark mode
- E-commerce and ad integration (basic)

## What's Left to Build
- Expand e-commerce integrations and product links
- Add more user preference and feedback features
- Further accessibility enhancements and audits

## Current Status
- MVP core features implemented and functional
- Ongoing improvements to suggestions, accessibility, and monetization

## Known Issues
- Some e-commerce integrations are placeholders
- Need more user testing for accessibility and internationalization
- Occasional API rate limits or data gaps from Open-Meteo

# Progress Checklist

| # | Feature/Task                                      | Status |
|---|---------------------------------------------------|--------|
| 1 | Last searched city persistence                    | [x]    |  
| 2 | Weather data cache for offline support            | [x]    |  
| 3 | Suggestion filter/toggle component                | [x]    |  
| 4 | Animated weather icons                            | [x]    |  
| 5 | Glassmorphic modals/sidebars                      | [x]    |
| 6 | Accessibility & responsiveness audit              | [x]    |
| 7 | Vitest tests for all stores and utils (90%+ coverage) | [x]    |
| 8 | Forecast comparison box (yesterday/today/tomorrow, highlight changes) | [x]    |
| 9 | City search input UI improvements (smaller input, beside localisation toggle, show location in today card) | [x]    |
| 10 | Feels‐Like vs. Actual Delta Chip                   | [x]    |
| 11 | UV & Air-Quality Strip                            | [x]    |
| 12 | Sunrise / Sunset & Golden-Hour Ring                | [x]    |
| 13 | Yesterday Comparison Badge                        | [x]    |
| 14 | Expandable Day Rows                               | [x]    |
| 15 | Drag-to-Scrub Hourly Graph                         | [x]    |
| 16 | Smart Activity Planner                             | [removed]    |
| 17 | Threshold-Based Push Alerts                        | [x]    |
| 18 | Wardrobe Carousel                                   | [x]    |
| 19 | Collapsible Header on Scroll                        | [ ]    |
| 20 | Animated Icon Pack                                 | [ ]    |
| 21 | Bottom-Sheet Quick-Search                           | [x]    |
| 22 | Night Mode Based on Location Time                      | [x]    |

## Notes
- 1: Store and restore last searched city using localStorage and Svelte store.
- 2: Weather data is cached in localStorage and used for offline fallback.
- 3: Suggestion filter/toggle UI and store implemented; suggestions update live.
- 4: Animated SVG weather icons integrated in main weather display.
- 5: Reusable, accessible glassmorphic modal component implemented.
- 6: Accessibility and responsiveness improved: focus states, aria-live, keyboard nav, contrast, responsive layouts.
- 7: All store and utility tests now pass after fixing the suggestion filter store test subscription issue.
- Svelte component tests remain blocked by Svelte 5/Vitest compatibility issues.

- 8: ForecastComparisonBox component compares yesterday, today, and tomorrow for key metrics, highlighting changes. API now fetches past_days=1 for yesterday's data.
- 9: City search input is now smaller and beside the language toggle; current location is shown in the today card.
- 10: Feels-Like vs. Actual Delta Chip is now shown in the current weather card, with color and icon for warmer/colder.
- 11: UV & Air-Quality Strip is now shown below the weather card, with color-coded risk and pollutant chips for UV, AQI, PM2.5, PM10, NO2, and O3.
- 12: Sunrise/Sunset & Golden-Hour Ring is now shown below the weather card, using daily sunrise/sunset data from the API.
- 13: Yesterday Comparison Badge is now shown in the current weather card, comparing today and yesterday for temperature and precipitation.
- 14: 7-day forecast now uses expandable day rows for detailed info (min/max temp, precip, wind, sunrise/sunset, etc).
- 15: Hourly forecast now includes a drag-to-scrub temperature graph with tooltip for value/time.
- 16: Smart Activity Planner feature and component have been removed from the dashboard and codebase per user request.
- 17: Threshold-based alerts (UV, AQI, rain, temp, wind) are now shown at the top of the dashboard. In-app banners, dismissible, with severity color.
- 21: Bottom-Sheet Quick-Search now features a mini map (Leaflet), clickable recent and favorite cities, city switching updates the dashboard, and all elements are accessible and responsive.
- 22: Night mode now automatically switches based on the selected location's sunrise/sunset and timezone. Weather icons reflect day/night. Manual override is respected. All changes are accessible and tested.