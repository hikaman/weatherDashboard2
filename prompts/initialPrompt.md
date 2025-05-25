Below is a single, comprehensive document designed for vibe coding your **WeatherWise Dashboard** using Cursor’s agent mode. The document includes a feature list, Product Requirements Document (PRD), a task list with a progress checklist, precise prompts for each task, and references. The structure is optimized to be loaded into Cursor’s agent prompt, enabling automatic implementation of tasks in agent mode until completion. The project uses the **Open-Meteo API**, **Svelte**, and **Tailwind CSS**, excludes login functionality, and focuses on a weather dashboard with wardrobe, activity, food, and exercise suggestions.

The document is crafted to align with vibe coding best practices (clear, focused prompts; iterative tasks) and Cursor’s agent mode capabilities, ensuring the AI can systematically execute each task. The checklist allows you to track progress, and references provide resources for troubleshooting or manual adjustments.

---

# WeatherWise Dashboard: Vibe Coding Implementation Document

## Introduction

This document outlines the development of the **WeatherWise Dashboard**, a login-free weather application built with Svelte and Tailwind CSS, using the Open-Meteo API. The app displays weather data and provides personalized suggestions for wardrobe, activities, food, and exercises. Designed for vibe coding with Cursor in agent mode, this document includes a feature list, PRD, task list with prompts, a progress checklist, and references. Load this document into Cursor’s agent prompt to automatically implement tasks until all are complete.

---

## Feature List

1. **Weather Data Display**
   - Fetch and display current weather and 7-day forecast using Open-Meteo API based on user’s location or searched city.
   - Show temperature, humidity, wind speed, precipitation, and weather conditions.

2. **Suggestion Engine**
   - Suggest wardrobe items (e.g., umbrella for rain, shorts for warm days).
   - Recommend activities (e.g., picnic for sunny days, board games for rain).
   - Suggest food (e.g., hearty stew for cold days, smoothies for hot days).
   - Propose exercises (e.g., outdoor jogging for clear weather, indoor stretching for rain).

3. **User Interface**
   - Responsive dashboard with Tailwind CSS styling for weather and suggestions.
   - Search bar for city selection with autocomplete.
   - Filters to toggle suggestion types (wardrobe, activities, food, exercises).
   - Visual weather icons.

4. **Data Management**
   - Store last searched city in localStorage.
   - Cache weather data locally for offline access.

5. **Additional Features**
   - Light/dark mode toggle.
   - Weather alerts for extreme conditions (e.g., heavy rain, high winds).

---

## Product Requirements Document (PRD)

### Introduction
- **Project Name**: WeatherWise Dashboard
- **Purpose**: Deliver an intuitive, login-free weather dashboard with personalized lifestyle suggestions based on Open-Meteo API data, built with Svelte and Tailwind CSS.

### Objectives
- Provide a seamless, responsive user experience with real-time weather and tailored suggestions.
- Use localStorage for minimal data persistence, avoiding user accounts.
- Ensure a visually appealing, practical tool for weather-based planning.

### Target Audience
- General users (students, professionals, outdoor enthusiasts) seeking weather-driven recommendations.

### Features
1. **Weather Data Display**
   - Fetch real-time weather data using Open-Meteo API (no API key required).
   - Display current weather (temperature, humidity, wind speed, precipitation, conditions) and 7-day forecast.
   - Support geolocation or city search.

2. **Suggestion Engine**
   - Wardrobe: Suggest clothing based on temperature and precipitation (e.g., “raincoat” for rain, “t-shirt” for >25°C).
   - Activities: Recommend activities (e.g., “hiking” for sunny, “museum visit” for rain).
   - Food: Propose meals (e.g., “hot soup” for cold, “fruit salad” for hot).
   - Exercises: Suggest exercises (e.g., “cycling” for clear, “yoga” for rain).

3. **User Interface**
   - Responsive Tailwind CSS grid layout for weather and suggestions.
   - City search bar with Open-Meteo geocoding API autocomplete.
   - Toggle filters for suggestion categories.
   - Animated weather icons (e.g., Tailwind CSS animations or Skycons).

4. **Data Management**
   - Store last searched city in localStorage.
   - Cache weather data for offline access, refreshing when online.

5. **Additional Features**
   - Light/dark mode toggle with localStorage persistence.
   - Alerts for extreme weather (e.g., precipitation > 10 mm/h, wind speed > 50 km/h).

### Technical Requirements
- **Frontend**: Svelte (SvelteKit), Tailwind CSS.
- **API**: Open-Meteo for weather and geocoding.
- **Storage**: Browser localStorage.
- **Tools**: Cursor (agent mode), Vite for setup.

### Non-Requirements
- No user authentication.
- No server-side backend (client-side with API calls).

---

## Task List with Progress Checklist

Below is the task list for implementation, designed for Cursor’s agent mode. Each task includes a prompt, expected output, and a checkbox to track progress. Tasks are small and sequential to ensure smooth automation. After loading this document into Cursor’s agent prompt, the AI should execute each task in order, generating and integrating code until all tasks are complete.

| Task # | Description | Prompt | Expected Output | Status |
|--------|-------------|--------|-----------------|--------|
| 1 | **Set Up Project Structure** | Initialize a SvelteKit project with Vite. Integrate Tailwind CSS. Create folders: `src/components`, `src/stores`, `src/utils`. Set up `App.svelte` with a header and main section, styled with Tailwind CSS for a responsive layout. | SvelteKit project with Tailwind CSS, basic `App.svelte` displaying a styled header and main section. | [ ] |
| 2 | **Fetch Weather Data** | Create a Svelte store to fetch current weather and 7-day forecast from Open-Meteo API using latitude/longitude. Support geolocation and city queries via Open-Meteo’s geocoding API. Handle errors with a fallback message. | Svelte store fetching and storing weather data (temperature, humidity, wind speed, precipitation, conditions). | [ ] |
| 3 | **Display Weather Data** | Build a Svelte component to display current weather and 7-day forecast. Use Tailwind CSS for a responsive card layout with hover effects. Include temperature, humidity, wind speed, precipitation, and conditions. | Weather display component showing current and forecast data in styled cards. | [ ] |
| 4 | **Wardrobe Suggestions** | Create a Svelte component with logic to suggest wardrobe items based on Open-Meteo data (e.g., umbrella for precipitation > 0, t-shirt for temperature > 25°C). Display in a Tailwind CSS grid with icons. | Wardrobe suggestion component with weather-based clothing recommendations. | [ ] |
| 5 | **Activity Suggestions** | Add a Svelte component to suggest activities based on weather (e.g., picnic for clear skies, board games for precipitation > 0). Style with Tailwind CSS in a list format. | Activity suggestion component with weather-appropriate recommendations. | [ ] |
| 6 | **Food Suggestions** | Add a Svelte component for food suggestions based on weather (e.g., stew for temperature < 10°C, smoothie for temperature > 25°C). Use Tailwind CSS for a card-based layout. | Food suggestion component with weather-based meal ideas. | [ ] |
| 7 | **Exercise Suggestions** | Create a Svelte component for exercise suggestions based on weather (e.g., jogging for clear skies, yoga for precipitation > 0). Style with Tailwind CSS and bordered cards. | Exercise suggestion component with weather-appropriate exercise ideas. | [ ] |
| 8 | **Dashboard Layout** | Build a responsive Svelte dashboard component with a Tailwind CSS grid layout for weather and suggestion sections. Ensure mobile-friendly design with proper spacing. | Dashboard component displaying weather and suggestion sections in a responsive grid. | [ ] |
| 9 | **City Search Bar** | Add a city search bar to the dashboard using Open-Meteo’s geocoding API for autocomplete. Style with Tailwind CSS, including a dropdown for suggestions. | Search bar with autocomplete city suggestions, updating weather data on selection. | [ ] |
| 10 | **Suggestion Filters** | Implement toggle buttons in the dashboard to filter suggestions (wardrobe, activities, food, exercises). Use Tailwind CSS for styling and ensure accessibility. | Toggle buttons to show/hide suggestion categories, styled and accessible. | [ ] |
| 11 | **Weather Icons** | Integrate animated weather icons in the weather display using Tailwind CSS animations or Skycons, ensuring Svelte compatibility. | Animated weather icons (e.g., sun, rain) in the weather component. | [ ] |
| 12 | **Store Last City** | Create a Svelte store to save the last searched city (latitude, longitude, name) in localStorage and load it on app start. | Store persisting and loading the last searched city. | [ ] |
| 13 | **Cache Weather Data** | Implement a Svelte store to cache Open-Meteo weather data in localStorage for offline access. Refresh data when online; show fallback UI when offline. | Store caching weather data, enabling offline access with a fallback display. | [ ] |
| 14 | **Light/Dark Mode** | Add a light/dark mode toggle to the Svelte app, storing preference in localStorage. Apply Tailwind CSS dark mode classes. | Toggle switching between light/dark modes, persisting user preference. | [ ] |
| 15 | **Weather Alerts** | Create a Svelte component to display alerts for extreme conditions (e.g., precipitation > 10 mm/h, wind speed > 50 km/h) based on Open-Meteo data. Style with Tailwind CSS as a dismissible banner. | Alert banner for extreme weather, styled and dismissible. | [ ] |

---

## Instructions for Cursor Agent Mode

1. **Setup**: Create a new Svelte project in Cursor. Load this entire document into Cursor’s agent prompt or chat interface.
2. **Agent Mode Execution**:
   - Instruct Cursor’s agent mode to execute tasks sequentially (Task 1 to Task 15).
   - For each task, the agent should:
     - Generate code based on the provided prompt.
     - Integrate the code into the project (e.g., create/update files in `src/components`, `src/stores`).
     - Test the output by running `npm run dev` (Vite) and verifying functionality in the browser.
     - Mark the task as complete in the checklist ([x]) by updating the document.
   - If an error occurs, the agent should refine the code by adjusting the prompt (e.g., “Fix Tailwind CSS grid spacing for mobile”) and retry.
3. **Completion**: Continue until all tasks are marked complete. The agent should ensure the app is fully functional, with weather data, suggestions, UI, and additional features working as specified.
4. **Manual Oversight** (Optional): Periodically check the browser output (localhost:5173) to confirm the app’s appearance and functionality. Adjust prompts if specific styling or logic needs tweaking (e.g., “Add rounded corners to suggestion cards”).

---

## References

- **Open-Meteo API**: Free weather and geocoding API. Use `https://api.open-meteo.com/v1/forecast` for weather data and `https://geocoding-api.open-meteo.com/v1/search` for city search. [open-meteo.com](https://open-meteo.com)
- **SvelteKit Documentation**: Guide for Svelte project setup and component development. [kit.svelte.dev](https://kit.svelte.dev)
- **Tailwind CSS with SvelteKit**: Official setup guide for Tailwind CSS integration. [tailwindcss.com/docs/guides/sveltekit](https://tailwindcss.com/docs/guides/sveltekit)
- **Flowbite Svelte**: Pre-built Svelte components for UI elements (e.g., buttons, cards). [flowbite-svelte.com](https://flowbite-svelte.com)
- **Skycons**: Animated weather icons compatible with JavaScript. [github.com/darkskyapp/skycons](https://github.com/darkskyapp/skycons)
- **Vite Documentation**: Setup and development server for SvelteKit. [vitejs.dev](https://vitejs.dev)

---

## Additional Notes
- **Open-Meteo API**: No API key is required, simplifying client-side integration. Prompts include geocoding for city search, ensuring accurate location handling.
- **Agent Mode Optimization**: Prompts are concise and specific to avoid overwhelming Cursor’s agent. Each task focuses on a single component or feature, aligning with vibe coding best practices.
- **Testing**: The agent should verify each task’s output (e.g., weather data displays correctly, suggestions match conditions). If a task fails, Cursor should refine the code using context from the PRD or previous tasks.
- **Styling**: Tailwind CSS ensures rapid, responsive design. Flowbite Svelte components can be integrated via prompts like “Use Flowbite Svelte cards for suggestions.”
- **Offline Support**: LocalStorage handles persistence and caching, meeting the no-login requirement.
- **Troubleshooting**: If the agent struggles (e.g., with Skycons integration), refer to references or adjust the prompt (e.g., “Use Tailwind CSS animations instead of Skycons for weather icons”).

---

## Agent Prompt Instruction

**Prompt to Load into Cursor’s Agent Mode**:

> I am providing a comprehensive document for vibe coding a WeatherWise Dashboard with Svelte, Tailwind CSS, and Open-Meteo API. The document includes a feature list, PRD, task list with prompts, checklist, and references. Your task is to execute each task (1 to 15) in order, using the provided prompts to generate and integrate code into a SvelteKit project. For each task:
> - Generate code based on the prompt.
> - Integrate it into the project (create/update files in `src/components`, `src/stores`, etc.).
> - Test the output by running `npm run dev` and verifying functionality in the browser.
> - If successful, mark the task as complete ([x]) in the checklist.
> - If an error occurs, refine the code by adjusting the prompt and retry.
> Continue until all tasks are complete, ensuring the app is fully functional with weather data, suggestions, UI, and additional features as specified. Here is the document: [Paste the entire document above].

This instruction ensures Cursor’s agent mode systematically implements the project, leveraging the document’s structure for automation.

---

## Conclusion

This document is your all-in-one guide for vibe coding the WeatherWise Dashboard in Cursor’s agent mode. By loading it into the agent prompt, Cursor will execute each task, generate code, and integrate it into a fully functional SvelteKit app. The checklist tracks progress, and references support troubleshooting. The app will fetch weather data from Open-Meteo, display it with Tailwind CSS styling, and provide weather-based suggestions, all without a login. If you need specific adjustments (e.g., additional suggestion rules, custom styling), let me know, and I can refine the prompts or document!

--- 

**Current Date and Time**: 07:34 PM CEST, Sunday, May 25, 2025