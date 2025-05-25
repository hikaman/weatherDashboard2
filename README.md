# WeatherWise Dashboard

A modern, responsive weather dashboard built with SvelteKit and Tailwind CSS that provides real-time weather data and intelligent lifestyle suggestions based on current conditions.

## 🌟 Features

### Weather Data
- **Real-time Weather**: Current conditions and 7-day forecast using Open-Meteo API
- **Location Support**: Automatic geolocation detection and manual city search
- **Comprehensive Data**: Temperature, humidity, wind speed, precipitation, and weather conditions
- **Offline Support**: Cached weather data for offline access

### Smart Suggestions
- **Wardrobe Recommendations**: Clothing suggestions based on temperature, precipitation, and wind
- **Activity Suggestions**: Indoor/outdoor activities suited to current weather conditions
- **Food Recommendations**: Meal and drink suggestions based on temperature and weather
- **Exercise Suggestions**: Workout recommendations with intensity and location preferences

### User Experience
- **Responsive Design**: Mobile-first design that works on all screen sizes
- **Dark/Light Mode**: Toggle between themes with system preference detection
- **Customizable Filters**: Show/hide suggestion categories based on preferences
- **Weather Alerts**: Notifications for extreme weather conditions
- **Animated Icons**: Weather-appropriate icons with CSS animations

### Data Management
- **Local Storage**: Persistent settings and cached data
- **Last City Memory**: Remembers your last searched location
- **Filter Preferences**: Saves your suggestion category preferences
- **Dismissible Alerts**: Weather alerts can be dismissed and remembered

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Yarn or npm

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd weatherDashboard2
   ```

2. **Install dependencies**
   ```bash
   yarn install
   # or
   npm install
   ```

3. **Start the development server**
   ```bash
   yarn dev
   # or
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
yarn build
# or
npm run build
```

## 🏗️ Project Structure

```
src/
├── components/           # Svelte components
│   ├── Dashboard.svelte         # Main dashboard layout
│   ├── WeatherDisplay.svelte    # Weather data display
│   ├── WeatherAlerts.svelte     # Weather alert system
│   ├── CitySearch.svelte        # City search with autocomplete
│   ├── WardrobeSuggestions.svelte
│   ├── ActivitySuggestions.svelte
│   ├── FoodSuggestions.svelte
│   └── ExerciseSuggestions.svelte
├── stores/              # Svelte stores
│   └── weather.ts       # Weather data management
├── routes/              # SvelteKit routes
│   ├── +layout.svelte   # App layout
│   └── +page.svelte     # Main page
├── app.css             # Global styles
└── app.html            # HTML template
```

## 🎨 Design System

### Color Scheme
- **Light Mode**: Clean whites and grays with colorful accents
- **Dark Mode**: Dark grays with bright accents for contrast
- **Semantic Colors**: 
  - Blue for weather data
  - Green for positive/good conditions
  - Yellow for warnings
  - Red for alerts/extreme conditions

### Components
- **Weather Cards**: Rounded cards with hover effects
- **Suggestion Cards**: Gradient backgrounds with priority indicators
- **Filter Buttons**: Toggle states with smooth transitions
- **Alert Banners**: Color-coded with dismissible functionality

## 🌐 API Integration

### Open-Meteo API
- **Weather Data**: `https://api.open-meteo.com/v1/forecast`
- **Geocoding**: `https://geocoding-api.open-meteo.com/v1/search`
- **No API Key Required**: Free tier with generous limits
- **Real-time Data**: Current conditions and forecasts

### Data Caching
- Weather data cached for 1 hour
- Automatic refresh when online
- Graceful fallback to cached data when offline

## 🔧 Configuration

### Environment Variables
No environment variables required - the app uses the free Open-Meteo API.

### Customization
- **Suggestion Logic**: Modify suggestion algorithms in component files
- **Weather Thresholds**: Adjust alert thresholds in `WeatherAlerts.svelte`
- **Styling**: Customize colors and animations in Tailwind CSS classes

## 📱 Features in Detail

### Weather Display
- Large, animated weather icons
- Current temperature with "feels like"
- Detailed metrics (humidity, wind, precipitation)
- 7-day forecast with daily highs/lows
- Weather condition descriptions

### Smart Suggestions

#### Wardrobe
- Temperature-based clothing recommendations
- Rain gear for precipitation
- Wind protection for windy conditions
- Sun protection for clear, hot days
- Priority levels (high, medium, low)

#### Activities
- Outdoor activities for good weather
- Indoor alternatives for bad weather
- Seasonal activity suggestions
- Suitability ratings (perfect, good, okay, avoid)

#### Food & Drink
- Hot foods for cold weather
- Cold/refreshing options for hot weather
- Comfort foods for rainy days
- Hydration reminders for high humidity
- Meal type categorization

#### Exercise
- Outdoor workouts for ideal conditions
- Indoor alternatives for extreme weather
- Intensity recommendations
- Duration suggestions
- Location preferences (indoor/outdoor/both)

### Weather Alerts
- Heavy rain warnings (>10mm/h)
- Strong wind alerts (>30km/h)
- Extreme temperature warnings
- High humidity notifications
- Thunderstorm alerts
- Snow condition notices

## 🛠️ Technical Details

### Built With
- **SvelteKit**: Modern web framework
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool
- **Open-Meteo API**: Weather data provider

### Browser Support
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Progressive Web App features

### Performance
- Lazy loading of components
- Efficient state management with Svelte stores
- Minimal bundle size
- Fast initial load times

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Open-Meteo](https://open-meteo.com/) for providing free weather data
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Svelte](https://svelte.dev/) for the reactive web framework
- Weather icons and emojis for visual elements

## 📞 Support

If you encounter any issues or have questions:
1. Check the [Issues](../../issues) page
2. Create a new issue with detailed information
3. Include browser version and steps to reproduce

---

**WeatherWise Dashboard** - Your intelligent weather companion 🌤️
