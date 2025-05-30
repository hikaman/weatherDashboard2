# WeatherWise Dashboard: Missing Features Checklist

## Introduction

This document tracks the remaining features and enhancements required to fully implement the WeatherWise Dashboard according to the original implementation, glassmorphism update, and vibe coding prompt documents. Use this checklist to guide further development, ensure all requirements are met, and maintain code quality, accessibility, and user experience standards.

**References:**
- [Glassmorphism UI Update](./glassmorphism-update.md)
- [Vibe Coding Implementation Document](./initialPrompt.md)
- [WeatherWise Dashboard Implementation Document](./WeatherWise%20Dashboard%20Implementation%20Document.markdown)

---

## Missing Feature List

1. **Last Searched City Persistence**
   - Implement a Svelte store to persist the last searched city (name, latitude, longitude) in localStorage with secure JSON serialization.
   - **Acceptance Criteria:**
     - The last searched city is saved in localStorage after a search.
     - On reload, the app restores the last searched city from localStorage.
     - Data is securely serialized and deserialized.
   - **BDD Scenario:**
     - Given a user searches for a city,
       When the app is reloaded,
       Then the last searched city is automatically restored and displayed.

2. **Weather Data Cache for Offline Support**
   - Implement a Svelte store to cache weather data in localStorage for offline access and fallback when offline.
   - Add logic to refresh cached weather data when online and show fallback UI when offline.
   - **Acceptance Criteria:**
     - Weather data is cached in localStorage after retrieval.
     - When offline, the app displays cached data with a fallback UI.
     - When back online, the cache is refreshed.
   - **BDD Scenario:**
     - Given the user has previously loaded weather data,
       When the device goes offline,
       Then the app shows the cached weather data and fallback UI.

3. **Suggestion Filter/Toggle Component**
   - Create a UI component to allow users to toggle which suggestion categories (wardrobe, activities, food, exercises) are displayed.
   - **Acceptance Criteria:**
     - The filter/toggle component is visible and accessible.
     - Users can enable/disable suggestion categories.
     - The dashboard updates to show/hide suggestions accordingly.
   - **BDD Scenario:**
     - Given the filter/toggle component is present,
       When the user toggles a category,
       Then the corresponding suggestions are shown or hidden.

4. **Animated Weather Icons**
   - Integrate animated weather icons (e.g., Skycons or custom SVG/Tailwind CSS animations) in the weather display components.
   - **Acceptance Criteria:**
     - Weather icons are animated in all relevant components.
     - Animations are smooth and performant.
   - **BDD Scenario:**
     - Given weather data is displayed,
       When the user views the dashboard,
       Then animated icons are shown for each weather condition.

5. **Glassmorphic Modals/Sidebars**
   - Implement modal, sidebar, or overlay panel components styled with glassmorphism, including backdrop blur and clean design.
   - **Acceptance Criteria:**
     - Modals/sidebars use glassmorphism styles (blur, transparency).
     - Components are accessible and responsive.
   - **BDD Scenario:**
     - Given a modal or sidebar is triggered,
       When it appears,
       Then it uses glassmorphism styling and is accessible.

6. **Comprehensive Accessibility & Responsiveness Audit**
   - Conduct a final audit of all glassmorphic elements for accessibility (contrast ratios, focus indicators, keyboard navigation) and responsiveness (mobile, tablet, desktop).
   - Test humanized suggestions for screen reader compatibility.
   - **Acceptance Criteria:**
     - All UI elements meet accessibility standards (contrast, focus, keyboard nav).
     - The app is responsive across device sizes.
     - Suggestions are screen reader compatible.
   - **BDD Scenario:**
     - Given the app is audited,
       When tested with assistive tech and on various devices,
       Then all elements are accessible and responsive.

7. **Vitest Tests for All Components**
   - Add Vitest tests for all UI components and stores to achieve 90%+ test coverage, including UnifiedSuggestions, WeatherDisplay, CitySearch, WeatherAlerts, Dashboard, DarkModeToggle, and any new features.
   - **Acceptance Criteria:**
     - All components and stores have Vitest tests.
     - Test coverage is at least 90%.
   - **BDD Scenario:**
     - Given the codebase,
       When tests are run,
       Then coverage reports show 90%+ for components and stores.

8. **Forecast Comparison Box**
   - Add a UI box/component to display the weather forecast for yesterday, today, and tomorrow.
   - Calculate and display the difference in weather (e.g., temperature, precipitation, wind) between these days.
   - Highlight significant changes (e.g., large temperature swings, sudden rain, etc.) visually.
   - **Acceptance Criteria:**
     - The forecast box displays weather for yesterday, today, and tomorrow.
     - Differences between days are calculated and shown.
     - Significant changes are visually highlighted.
   - **BDD Scenario:**
     - Given weather data for three days,
       When the user views the forecast box,
       Then differences and significant changes are clearly shown.

9. **City Search Input UI Improvements**
   - Reduce the size of the city search input field and position it beside the localisation toggle for a more compact layout.
   - Display the current location name prominently in the header of the today weather card.
   - **Acceptance Criteria:**
     - The city search input is smaller and beside the localisation toggle.
     - The location name is shown in the today card header.
   - **BDD Scenario:**
     - Given the dashboard is loaded,
       When the user views the search input and today card,
       Then the input is compact and the location name is visible in the header.

10. **Feels‐Like vs. Actual Delta Chip**
   - Show a small chip next to the main temperature indicating the difference between feels-like and actual temperature. Highlight when the gap is significant.
   - **Tasks:**
     1. Design the delta chip UI and determine placement on the today card.
     2. Implement logic to calculate the feels-like vs. actual temperature difference.
     3. Add dynamic styling to highlight significant differences.
     4. Write tests for correct display and highlighting.
   - **Acceptance Criteria:**
     - The chip is visible next to the main temperature on the today card.
     - The chip displays the correct delta value (°C/°F).
     - The chip changes color or style when the delta exceeds a defined threshold (e.g., ±3°).
   - **BDD Scenario:**
     - Given the current temperature and feels-like temperature are available,
       When the user views the today weather card,
       Then the delta chip is shown with the correct value and highlights if the difference is significant.

11. **UV & Air-Quality Strip**
   - Add a pill-shaped strip below the hourly forecast with UV index and AQI icons/values. Tapping opens a modal with protection tips.
   - **Tasks:**
     1. Design the pill-shaped strip and select appropriate icons.
     2. Integrate UV and AQI data sources.
     3. Implement modal with actionable protection tips.
     4. Write tests for display, data accuracy, and modal interaction.
   - **Acceptance Criteria:**
     - The strip is visible below the hourly forecast.
     - UV index and AQI values are displayed with appropriate icons.
     - Tapping the strip opens a modal with actionable tips.
   - **BDD Scenario:**
     - Given UV and AQI data are available,
       When the user taps the strip,
       Then a modal appears with relevant protection tips.

12. **Sunrise / Sunset & Golden-Hour Ring**
   - Display a circular progress ring showing the current position between sunrise and sunset, with golden-hour highlighted.
   - **Tasks:**
     1. Design the circular progress ring UI.
     2. Calculate sunrise, sunset, and golden-hour times.
     3. Implement real-time progress and golden-hour highlighting.
     4. Write tests for time calculations and UI updates.
   - **Acceptance Criteria:**
     - The ring is visible on the main dashboard.
     - The current time is accurately represented on the ring.
     - Golden-hour is visually distinct.
   - **BDD Scenario:**
     - Given sunrise and sunset times are available,
       When the user views the dashboard,
       Then the ring shows the current position and highlights golden-hour.

13. **Yesterday Comparison Badge**
   - Compare today's high/low to yesterday's weather and show a badge if it's significantly warmer/colder than yesterday.
   - **Tasks:**
     1. Fetch and store yesterday's weather data.
     2. Implement logic to compare today's and yesterday's temperatures.
     3. Design and display the badge with deviation text.
     4. Write tests for threshold logic and badge display.
   - **Acceptance Criteria:**
     - The badge appears only if today's temperature deviates from yesterday's by a set threshold.
     - The badge text reflects the deviation (e.g., "3° warmer than yesterday").
   - **BDD Scenario:**
     - Given yesterday's weather data is available,
       When today's temperature is significantly different from yesterday's,
       Then the badge is shown with the correct message.

14. **Expandable Day Rows**
   - Allow tapping any day in the 7-day panel to expand and show an embedded hourly forecast for that day.
   - **Tasks:**
     1. Update the 7-day forecast UI to support expandable rows.
     2. Implement logic to fetch and display hourly data for the selected day.
     3. Ensure only one row expands at a time.
     4. Write tests for expand/collapse and data accuracy.
   - **Acceptance Criteria:**
     - Each day row is tappable.
     - Tapping expands the row to show hourly data and collapses others.
   - **BDD Scenario:**
     - Given a 7-day forecast is displayed,
       When the user taps a day,
       Then that day's row expands to show hourly details and others collapse.

15. **Drag-to-Scrub Hourly Graph**
   - Enable users to drag across the hourly bar to see a floating tooltip with conditions at that time.
   - **Tasks:**
     1. Design the draggable hourly graph and tooltip UI.
     2. Implement drag interaction and tooltip updates.
     3. Ensure accessibility for keyboard and touch users.
     4. Write tests for drag, tooltip, and accessibility.
   - **Acceptance Criteria:**
     - The hourly graph is draggable.
     - A tooltip appears and updates as the user drags.
   - **BDD Scenario:**
     - Given the hourly forecast is visible,
       When the user drags across the graph,
       Then a tooltip shows the weather for the selected hour.

16. **Smart Activity Planner**
   - Let users pick an activity and surface the best weather windows for it, with a "Plan" button to export to calendar.
   - **Tasks:**
     1. Create UI for activity selection and weather window suggestions.
     2. Implement logic to analyze weather and suggest optimal times.
     3. Integrate calendar export functionality.
     4. Write tests for activity selection, suggestion accuracy, and export.
   - **Acceptance Criteria:**
     - Users can select from a list of activities.
     - The app suggests optimal time windows based on weather.
     - The "Plan" button exports the event to the user's calendar.
   - **BDD Scenario:**
     - Given the user selects an activity,
       When the app finds suitable weather windows,
       Then the user can export a chosen window to their calendar.

17. **Threshold-Based Push Alerts**
   - Allow users to set personal weather thresholds for alerts (e.g., wind, rain) and receive notifications or suggestion cards.
   - **Tasks:**
     1. Design UI for setting and saving thresholds.
     2. Implement alert logic and notification delivery.
     3. Integrate with suggestion card system.
     4. Write tests for threshold logic and alert delivery.
   - **Acceptance Criteria:**
     - Users can set and save custom thresholds.
     - Alerts are triggered and shown as notifications or cards when thresholds are met.
   - **BDD Scenario:**
     - Given a user-defined threshold exists,
       When the forecast meets or exceeds the threshold,
       Then the user receives an alert.

18. **Wardrobe Carousel**
   - Add a swipeable carousel of outfit suggestions that adapt to weather conditions.
   - **Tasks:**
     1. Design the carousel UI and outfit suggestion logic.
     2. Integrate weather data for dynamic suggestions.
     3. Implement swipe interaction and accessibility.
     4. Write tests for suggestion accuracy and carousel usability.
   - **Acceptance Criteria:**
     - The carousel is visible and swipeable.
     - Outfit suggestions update based on weather.
   - **BDD Scenario:**
     - Given current weather data,
       When the user swipes the carousel,
       Then outfit suggestions are relevant to the weather.

19. **Collapsible Header on Scroll**
   - Shrink the large temperature block into a compact bar as the user scrolls, freeing space for the forecast list.
   - **Tasks:**
     1. Design the collapsible header and compact bar UI.
     2. Implement scroll detection and header animation.
     3. Ensure header remains accessible and readable.
     4. Write tests for scroll behavior and UI transitions.
   - **Acceptance Criteria:**
     - The header shrinks smoothly as the user scrolls down.
     - The compact bar remains accessible and readable.
   - **BDD Scenario:**
     - Given the user scrolls the dashboard,
       When the scroll passes a threshold,
       Then the header collapses into a compact bar.

20. **Animated Icon Pack**
   - Replace static weather icons with animated SVG/Lottie icons.
   - **Tasks:**
     1. Select or create animated icon assets.
     2. Integrate animated icons into all relevant components.
     3. Optimize for performance and smoothness.
     4. Write tests for icon display and animation.
   - **Acceptance Criteria:**
     - All weather icons are animated.
     - Animations are smooth and do not impact performance.
   - **BDD Scenario:**
     - Given weather icons are displayed,
       When the user views the dashboard,
       Then all icons are animated appropriately.

21. **Bottom-Sheet Quick-Search**
   - Implement a pull-up bottom sheet with a mini map and recent/favorite cities for fast city switching.
   - **Tasks:**
     1. Design the bottom sheet UI and mini map integration.
     2. Implement recent/favorite city management.
     3. Add city selection logic to update the dashboard.
     4. Write tests for sheet interaction and city switching.
   - **Acceptance Criteria:**
     - The bottom sheet can be pulled up from the bottom of the screen.
     - It displays a mini map and a list of recent/favorite cities.
     - Selecting a city updates the dashboard.
   - **BDD Scenario:**
     - Given the user pulls up the bottom sheet,
       When they select a city,
       Then the dashboard updates to show that city's weather.

22. **Night Mode Based on Location Time**
   - Implement automatic night mode switching based on the time at the selected location. Weather icons should also reflect day/night changes at that location.
   - **Tasks:**
     1. Detect the current time at the selected location and determine day/night status.
     2. Implement automatic theme switching between day and night modes based on location time.
     3. Update weather icons to visually reflect day or night at the location.
     4. Write tests for location time detection, theme switching, and icon updates.
   - **Acceptance Criteria:**
     - The app automatically switches to night mode after sunset and back to day mode after sunrise based on the selected location's time.
     - Weather icons change appearance to match day or night at the location.
     - Manual override (if present) does not interfere with automatic switching.
   - **BDD Scenario:**
     - Given the selected location's time is after sunset,
       When the user opens the app,
       Then the UI is in night mode and icons reflect nighttime conditions for that location.
     - Given the selected location's time is after sunrise,
       When the user opens the app,
       Then the UI is in day mode and icons reflect daytime conditions for that location.

---

## Progress Checklist

| # | Feature/Task                                      | Status |
|---|---------------------------------------------------|--------|
| 1 | Last searched city persistence                    | [ ]    |
| 2 | Weather data cache for offline support            | [ ]    |
| 3 | Suggestion filter/toggle component                | [ ]    |
| 4 | Animated weather icons                            | [ ]    |
| 5 | Glassmorphic modals/sidebars                      | [ ]    |
| 6 | Accessibility & responsiveness audit              | [ ]    |
| 7 | Vitest tests for all components (90%+ coverage)   | [ ]    |
| 8 | Forecast comparison box (yesterday/today/tomorrow, highlight changes) | [ ]    |
| 9 | City search input UI improvements (smaller input, beside localisation toggle, show location in today card) | [ ]    |
| 10 | Feels‐Like vs. Actual Delta Chip                   | [ ]    |
| 11 | UV & Air-Quality Strip                            | [ ]    |
| 12 | Sunrise / Sunset & Golden-Hour Ring                | [ ]    |
| 13 | Yesterday Comparison Badge                        | [ ]    |
| 14 | Expandable Day Rows                               | [ ]    |
| 15 | Drag-to-Scrub Hourly Graph                         | [ ]    |
| 16 | Smart Activity Planner                             | [ ]    |
| 17 | Threshold-Based Push Alerts                        | [ ]    |
| 18 | Wardrobe Carousel                                   | [ ]    |
| 19 | Collapsible Header on Scroll                        | [ ]    |
| 20 | Animated Icon Pack                                 | [ ]    |
| 21 | Bottom-Sheet Quick-Search                           | [ ]    |
| 22 | Night Mode Based on Location Time                      | [ ]    |

---

## Instructions for Completion

- For each feature, implement the required functionality following the code quality, security, accessibility, and testing standards outlined in the original documents.
- After implementing each feature, update the checklist status to [x].
- Ensure all new code is type-safe, tested, accessible, and follows the glassmorphism and design system guidelines.
- Run the full testing protocol (build, visual, functionality, responsive, accessibility, dark/light mode, cross-browser) before marking a feature as complete.

---

**Use this document as your authoritative source for remaining work.** 