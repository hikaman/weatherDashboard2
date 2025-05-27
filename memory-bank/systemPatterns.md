# System Patterns

## System Architecture
- SvelteKit frontend with modular components (Dashboard, WeatherDisplay, UnifiedSuggestions, etc.)
- Weather data from Open-Meteo API; geocoding for city search
- State management via Svelte stores
- E-commerce and ad integration via external APIs

## Key Technical Decisions
- Use of SvelteKit for fast, modern web app development
- Tailwind CSS for responsive, glassmorphic UI
- TypeScript for type safety
- Bun for package management and scripts

## Design Patterns in Use
- Store-based state management
- Component-driven UI
- API abstraction for weather and geocoding
- Accessibility-first design

## Component Relationships
- Dashboard aggregates WeatherDisplay, HourlyForecast, UnifiedSuggestions, CitySearch
- UnifiedSuggestions generates and displays all suggestion types based on weather data