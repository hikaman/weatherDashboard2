# WeatherWise Dashboard

A modern, responsive weather dashboard built with SvelteKit, TypeScript, and Tailwind CSS. Get real-time weather data and personalized suggestions for wardrobe, activities, food, and exercises based on current weather conditions.

## Features

### Weather Data Display
- **Current Weather**: Temperature, humidity, wind speed, precipitation, and weather conditions
- **24-Hour Forecast**: Hourly temperature, precipitation probability, and weather conditions
- **7-Day Forecast**: Extended forecast with daily high/low temperatures and weather icons
- **Location Support**: Automatic geolocation or manual city search
- **Real-time Updates**: Fresh weather data from Open-Meteo API

### Smart Suggestions
- **Wardrobe**: Clothing recommendations based on temperature, precipitation, and wind
- **Activities**: Indoor/outdoor activity suggestions optimized for current weather
- **Food**: Meal and drink recommendations that match the weather mood
- **Exercise**: Fitness activities tailored to weather conditions and intensity levels

### User Experience
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Dark Mode Support**: Automatic theme detection with manual toggle
- **City Search**: Autocomplete search with Open-Meteo geocoding API
- **Offline Support**: Cached weather data for offline access
- **Accessibility**: ARIA labels and keyboard navigation support

## Technology Stack

- **Frontend**: SvelteKit 2.16+ with TypeScript
- **Styling**: Tailwind CSS 3.4+ with responsive design
- **API**: Open-Meteo (weather and geocoding) - no API key required
- **Package Manager**: Bun for fast dependency management
- **Testing**: Vitest with @testing-library/svelte
- **Code Quality**: ESLint, Prettier, and TypeScript strict mode

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

## Project Structure

```
src/
├── components/           # Svelte components
│   ├── Dashboard.svelte     # Main dashboard layout
│   ├── WeatherDisplay.svelte # Current weather and forecast
│   ├── CitySearch.svelte    # City search with autocomplete
│   ├── WardrobeSuggestions.svelte
│   ├── ActivitySuggestions.svelte
│   ├── FoodSuggestions.svelte
│   └── ExerciseSuggestions.svelte
├── stores/              # Svelte stores
│   └── weather.ts          # Weather data management
├── routes/              # SvelteKit routes
│   └── +page.svelte        # Main page
└── app.html            # HTML template
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

### Local Storage
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

### Test Coverage
- Weather store functionality
- API integration
- Error handling
- Input sanitization

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
