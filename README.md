# WeatherWise Dashboard

A comprehensive weather application with smart lifestyle suggestions, built with SvelteKit, TypeScript, and Tailwind CSS. Features real-time weather data, air quality monitoring, and intelligent recommendations for wardrobe and activities.

## 🌟 Features

### Core Weather Data
- **Real-time Weather**: Current conditions with apparent temperature, humidity, wind, and visibility
- **Extended Forecasts**: 16-day daily forecasts and 7-day hourly predictions
- **Historical Context**: 30-day historical averages for trend comparison
- **Air Quality Monitoring**: PM2.5, PM10, carbon monoxide, and ozone levels
- **UV Index Tracking**: Real-time UV radiation levels for sun safety

### Smart Suggestions
- **Wardrobe Recommendations**: 
  - Separate suggestions for adults and children
  - Based on apparent temperature, precipitation, wind, UV index, and air quality
  - Priority-based recommendations (high/medium/low)
  - Category-specific advice (temperature, precipitation, wind, UV, air quality)

- **Activity Suggestions**:
  - General activities and family-friendly options with kids
  - Weather-optimized recommendations with safety considerations
  - Intensity levels (low/moderate/high) and duration estimates
  - Indoor/outdoor/mixed activity types
  - Air quality and UV safety factors

### Advanced Features
- **Comprehensive API Integration**: Multiple Open-Meteo endpoints for complete weather picture
- **Smart Caching**: 1-hour weather data caching with offline support
- **City Search**: Autocomplete search with geocoding
- **Weather Alerts**: Dismissible alerts for extreme weather conditions
- **Dark/Light Mode**: System preference detection with manual toggle
- **Responsive Design**: Mobile-first design with desktop optimization
- **Historical Trends**: Compare current conditions to historical averages

## 🚀 Technology Stack

- **Frontend**: SvelteKit 2.x with TypeScript
- **Styling**: Tailwind CSS 3.x with custom animations
- **APIs**: Open-Meteo (Forecast, Historical, Air Quality, Geocoding)
- **Deployment**: AWS Amplify ready with static site generation
- **Storage**: localStorage for persistence and caching

## 📊 API Integration

### Open-Meteo Endpoints Used
1. **Forecast API**: Current weather, hourly/daily forecasts (16 days)
2. **Historical Weather API**: 30-day historical data for trend analysis
3. **Air Quality API**: PM2.5, PM10, CO, O3 monitoring
4. **Geocoding API**: City search and coordinate resolution

### Data Aggregation Strategy
- **Concurrent API Calls**: Parallel fetching for optimal performance
- **Smart Caching**: Location-based caching with TTL management
- **Data Merging**: Hourly weather and air quality data alignment
- **Error Handling**: Graceful fallbacks and offline support

## 🎯 Smart Recommendation Logic

### Wardrobe Suggestions
- **Temperature-based**: Uses apparent temperature for accuracy
- **Weather-specific**: Rain, wind, UV, and air quality considerations
- **Age-appropriate**: Different recommendations for adults vs children
- **Safety-focused**: Extra protection for extreme conditions

### Activity Recommendations
- **Condition-aware**: Considers all weather factors simultaneously
- **Safety-first**: Air quality and UV warnings for outdoor activities
- **Family-friendly**: Separate suggestions for activities with children
- **Flexible options**: Indoor alternatives for poor weather

## 🛠️ Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Local Development
```bash
# Clone the repository
git clone <repository-url>
cd weatherDashboard2

# Install dependencies
npm install

# Start development server
npm run dev

# Open browser to http://localhost:5173
```

### Build for Production
```bash
# Build static site
npm run build

# Preview production build
npm run preview
```

## 🌐 AWS Amplify Deployment

The application is optimized for AWS Amplify deployment with:

- **Static Site Generation**: Pre-rendered pages for optimal performance
- **Automatic HTTPS**: SSL certificates included
- **Global CDN**: Fast loading worldwide
- **Build Configuration**: `amplify.yml` included

### Deploy to Amplify
1. Push code to GitHub
2. Connect repository to AWS Amplify
3. Amplify auto-detects build settings
4. Deploy and get live URL

See `DEPLOYMENT.md` for detailed deployment instructions.

## 📱 Usage

### Getting Started
1. **Location Access**: Allow location access or search for a city
2. **Weather Overview**: View current conditions and 7-day forecast
3. **Smart Suggestions**: Check wardrobe and activity recommendations
4. **Customize View**: Toggle between adult/child suggestions
5. **Weather Alerts**: Dismiss alerts for extreme conditions

### Features Overview
- **City Search**: Type city name for autocomplete suggestions
- **Suggestion Filters**: Toggle wardrobe, activities, food, and exercise suggestions
- **Theme Toggle**: Switch between light and dark modes
- **Weather Alerts**: Get notified of extreme weather conditions
- **Offline Support**: Cached data available when offline

## 🎨 Design Features

### Visual Elements
- **Animated Weather Icons**: CSS animations for weather conditions
- **Color-coded Priorities**: Visual hierarchy for recommendations
- **Responsive Grid**: Adaptive layout for all screen sizes
- **Dark Mode Support**: Complete dark theme implementation

### User Experience
- **Loading States**: Smooth loading indicators
- **Error Handling**: User-friendly error messages
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized for fast loading and smooth interactions

## 🔧 Configuration

### Environment Variables
No environment variables required - uses free Open-Meteo API.

### Customization
- **Suggestion Logic**: Modify recommendation algorithms in component files
- **Styling**: Customize Tailwind CSS configuration
- **API Endpoints**: Extend with additional Open-Meteo features
- **Caching**: Adjust cache TTL in weather store

## 📊 Data Sources

### Weather Data
- **Provider**: Open-Meteo (open-source weather API)
- **Coverage**: Global weather data
- **Update Frequency**: Hourly updates
- **Historical Range**: 1940-present
- **Forecast Range**: 16 days

### Air Quality Data
- **Pollutants**: PM2.5, PM10, CO, O3
- **Health Standards**: WHO air quality guidelines
- **Update Frequency**: Hourly
- **Coverage**: Global monitoring stations

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Open-Meteo**: Free weather API service
- **SvelteKit**: Modern web framework
- **Tailwind CSS**: Utility-first CSS framework
- **AWS Amplify**: Hosting and deployment platform

## 📞 Support

For support, please open an issue on GitHub or contact the development team.

---

**WeatherWise Dashboard** - Making weather data actionable for daily life decisions. 🌤️
