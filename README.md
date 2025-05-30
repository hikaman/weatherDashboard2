# WeatherWise Dashboard

A modern, responsive weather dashboard built with SvelteKit, TypeScript, and Tailwind CSS. Get real-time weather data and personalized suggestions for wardrobe, activities, food, and exercises based on current weather conditions.

---

## High-Level Codebase Summary

See [docs/codebase-summary.md](docs/codebase-summary.md) for a detailed high-level summary of the codebase, including project structure, conventions, and recommendations.

---

## Features

### Weather Data Display
- **Current Weather**: Temperature, humidity, wind speed, precipitation, and weather conditions
- **24-Hour Forecast**: Hourly temperature, precipitation probability, and weather conditions
- **7-Day Forecast**: Extended forecast with daily high/low temperatures and weather icons
- **Location Support**: Automatic geolocation or manual city search
- **Real-time Updates**: Fresh weather data from Open-Meteo API
- **Yesterday/Today Comparison**: Visual badge for temperature and precipitation changes
- **UV & Air Quality Strip**: Color-coded risk and pollutant chips
- **Sunrise/Sunset & Golden-Hour Ring**: Visual ring for daily sun events
- **Night Mode**: Auto-switches based on location time, with manual override
- **Weather Icons**: Animated SVG icons are shown for weather conditions. Icons are grouped by weather type (e.g., all rain codes share a rain icon). Individual icons for each WMO weather code are planned.

### Smart Suggestions 2.0
- **Wardrobe**: Personalized outfit suggestions
- **Food**: Contextual meal ideas
- **Activity**: Active and cozy suggestions
- **E-Commerce Add-On**: Shopping hints with affiliate links
- **Wardrobe Carousel**: Scrollable, accessible outfit cards

### User Experience & Internationalization
- **Multi-language**: Full German & English support
- **Language Toggle**: Saves user preference
- **Responsive Design & Dark-Mode**: Mobile-first, glassmorphic UI
- **City Search**: Autocomplete with geocoding
- **Offline Support**: Weather data cache (1h)
- **Accessibility**: WCAG 2.1 AA, ARIA, keyboard navigation

### Additional Features
- **Bottom-Sheet Quick-Search**: Mini map, recent/favorite cities
- **Threshold-Based Alerts**: Dismissible banners for severe weather
- **Expandable Day Rows**: Detailed 7-day forecast
- **Drag-to-Scrub Hourly Graph**: Interactive temperature graph

## Technology Stack

- **Frontend**: SvelteKit 2.16+ with TypeScript (strict mode)
- **Styling**: Tailwind CSS 3.4+, Shadcn components
- **API**: Open-Meteo (weather, geocoding, air quality)
- **Package Manager**: Bun
- **Testing**: Vitest with @testing-library/svelte
- **Code Quality**: ESLint, Prettier
- **Internationalization**: Paraglide.js

## Project Structure (excerpt)

```
src/
├── components/           # Svelte UI components (dashboard, weather, search, modals, etc.)
├── routes/               # SvelteKit file-based routing (layouts, pages)
├── lib/                  # Utilities, API integrations, i18n, state mappers, city list
├── stores/               # Svelte stores for weather, air quality, alerts, filters
├── utils/                # Utility functions (e.g., weather themes)
memory-bank/              # Project decisions, context, progress, patterns
.cursor/rules/            # Core rules, tailored guidelines, SvelteKit dev guide
docs/                     # Documentation (see codebase-summary.md)
```

## For More Information

- See [docs/codebase-summary.md](docs/codebase-summary.md) for a high-level summary
- See `memory-bank/` for decision logs, technical context, and product context
- See `.cursor/rules/` for project rules and SvelteKit development guide

---

## Getting Started

### Prerequisites
- [Bun](https://bun.sh/) (latest version)
- Node.js 18+ (for compatibility)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weatherwise-dashboard
   ```

2. **Install dependencies**
   ```bash
   bun install
   ```

3. **Start development server**
   ```bash
   bun run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Available Scripts

```bash
# Development
bun run dev          # Start development server
bun run build        # Build for production
bun run preview      # Preview production build

# Testing
bun run test         # Run tests
bun run test:watch   # Run tests in watch mode
bun run test:coverage # Run tests with coverage

# Code Quality
bun run lint         # Lint code
bun run lint:fix     # Fix linting issues
bun run format       # Format code
bun run format:check # Check code formatting
```

## API Integration

### Open-Meteo Weather API
- **Endpoint**: `https://api.open-meteo.com/v1/forecast`
- **Features**: Current weather, 7-day forecast, hourly data
- **No API Key Required**: Free tier with generous limits

### Open-Meteo Geocoding API
- **Endpoint**: `https://geocoding-api.open-meteo.com/v1/search`
- **Features**: City search, coordinates, country/region info
- **Input Sanitization**: XSS protection and validation

## Data Management

### Local Storage & Persistence
- **Last Searched City**: Persisted for quick access
- **Weather Data Cache**: 1-hour TTL for offline support
- **User Preferences**: Theme and filter settings

### Security
- **Input Sanitization**: All user inputs are sanitized
- **XSS Protection**: Secure handling of search queries
- **Error Handling**: Graceful fallbacks for API failures

## Testing

The project uses Vitest for testing with comprehensive coverage:

```bash
# Run all tests
bun run test

# Watch mode for development
bun run test:watch

# Coverage report
bun run test:coverage
```

### Test Coverage (90 %+)
- Wetter-Store & API-Integration  
- Internationalisierung & Locale-Persistenz  
- Zufallsgenerierte Suggestion-Texte  
- Sicherheits- & Fehlermanagement

## Browser Support

- **Modern Browsers**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+
- **Features**: ES2022, CSS Grid, Flexbox, CSS Custom Properties

## Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with tests
4. **Run the test suite**: `bun run test`
5. **Lint your code**: `bun run lint`
6. **Commit your changes**: `git commit -m 'Add amazing feature'`
7. **Push to the branch**: `git push origin feature/amazing-feature`
8. **Open a Pull Request**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for free weather API
- [SvelteKit](https://kit.svelte.dev/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Bun](https://bun.sh/) for fast package management

## Night Mode Based on Location Time
- The app automatically switches between day and night mode based on the selected location's sunrise/sunset and timezone.
- Weather icons visually reflect day/night at the location.
- Manual override is respected: toggling dark mode sets an override, double-clicking the toggle clears it to return to auto mode.

## Accessibility & Testing
- All interactive elements are accessible (keyboard, ARIA, focus states).
- To run tests: `npm run test` (store, util, and integration tests for all features, including night mode logic).

- Smart Activity Planner: This feature has been removed from the dashboard and codebase per user request.
