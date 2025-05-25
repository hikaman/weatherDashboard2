# WeatherSync Decision Hub (MVP)

A focused Minimum Viable Product (MVP) that empowers users to make informed, weather-driven decisions about **wardrobe** (primary focus), **fitness and exercise**, **meals**, and **activities**. Built with SvelteKit, TypeScript, and Tailwind CSS.

## 🌟 Features

### Core Decision-Making Features
- **🌦️ Transition Forecast**: Predicts weather state changes with probabilities using YAML weather state transitions
- **👗 Smart Weather Wardrobe Advisor**: Primary focus on outfit choices with e-commerce integration
- **💪 Weather-Optimized Fitness Advisor**: Tailored exercise proposals based on weather conditions
- **🍽️ Weather-Adaptive Meal Planner**: Meal recommendations with grocery integration
- **🎯 Weather-Tethered Adventure Curator**: Activity suggestions with ticket purchase options

### Advanced UI Components
- **⏰ Decision Timeline**: 24-hour forecast with probability bars and recommendations
- **🗺️ Weather Map**: Interactive map with weather overlays and activity pins using Leaflet.js
- **📔 Decision Journal**: Logs decisions with gamified badges and purchase history
- **🛍️ WeatherSync Mini-Shop**: Curated weather-relevant products with affiliate links

### E-commerce Integration
- **Amazon** - Clothing and general items
- **Zappos** - Footwear and accessories  
- **Nike** - Fitness gear and athletic wear
- **Instacart** - Grocery delivery for meal ingredients
- **Eventbrite** - Event tickets and activities

### Weather Data & Intelligence
- **Open-Meteo API** integration for comprehensive weather data
- **16 Weather States** with YAML-based transitions (Heatwave, Showery, Cold, etc.)
- **Probability-based forecasting** combining API data with transition likelihoods
- **Regional filtering** and contextual recommendations

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd weatherDashboard2

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the application.

### Build for Production

```bash
npm run build
npm run preview
```

## 🏗️ Architecture

### Project Structure
```
src/
├── components/           # Svelte components
│   ├── Dashboard.svelte         # Main dashboard layout
│   ├── DecisionTimeline.svelte  # 24-hour decision timeline
│   ├── WeatherMap.svelte        # Interactive weather map
│   ├── DecisionJournal.svelte   # Decision logging with badges
│   ├── WeatherSyncMiniShop.svelte # E-commerce integration
│   ├── WeatherDisplay.svelte    # Current weather display
│   ├── CitySearch.svelte        # Location search
│   └── [Suggestion Components]  # Wardrobe, Fitness, Food, Activity
├── lib/                  # Utilities and data
│   ├── weatherStates.yaml       # 16 weather states & transitions
│   ├── weatherStatesData.ts     # TypeScript weather state data
│   ├── weatherStateMapper.ts    # Weather state mapping logic
│   └── ecommerce.ts            # E-commerce integration utilities
├── stores/               # Svelte stores
│   └── weather.ts              # Weather data management
└── routes/               # SvelteKit routes
    └── +page.svelte            # Main application page
```

### Weather State System

The application uses a sophisticated 16-state weather classification system:

- **Heatwave** (>35°C) → Showery, Hot_Sunny
- **Hot_Sunny** (25-35°C) → Heatwave, Showery  
- **Sunny** (15-25°C) → Hot_Sunny, Cloudy
- **Mild** (10-20°C) → Sunny, Cloudy
- **Cold** (0-10°C) → Freezing, Snowy
- **Freezing** (<0°C) → Snowy, Cold
- **Showery** → Rainy, Cloudy
- **Rainy** → Stormy, Showery
- **Stormy** → Rainy, Windy
- **Cloudy** → Showery, Sunny
- **Windy** → Stormy, Cloudy
- **Foggy** → Cloudy, Sunny
- **Snowy** → Freezing, Cold
- **Humid** → Showery, Hot_Sunny
- **Dry** → Sunny, Windy

Each state includes transition probabilities and specific recommendations for wardrobe, fitness, meals, and activities.

## 🛍️ E-commerce Integration

### Affiliate Program Setup

The application includes affiliate tracking for revenue generation:

```typescript
// Example affiliate link generation
const affiliateLink = generateAffiliateLink(
  'amazon', 
  'rain jacket',
  { utm_campaign: 'weather_decision' }
);
```

### Purchase Tracking

All purchase intents are tracked for analytics:

```typescript
trackPurchase({
  productId: 'rain-jacket-1',
  productName: 'Lightweight Rain Jacket',
  store: 'amazon',
  price: '$49.99',
  weatherState: 'Showery',
  category: 'wardrobe'
});
```

## 🎮 Gamification

### Achievement System

Users earn badges for weather-informed decisions:

- **🌧️ Rainy Explorer** - 5 rainy weather activities
- **☀️ Sunny Adventurer** - 10 sunny day activities  
- **🧘 Showery Yogi** - Indoor yoga during showery weather
- **🧠 Weather Wise** - 20 weather-informed decisions
- **👗 Fashion Forward** - 5 weather-appropriate purchases
- **💪 Fitness Fanatic** - 15 weather-adapted workouts
- **🍽️ Foodie Forecaster** - 10 weather-inspired meals
- **🦋 Social Butterfly** - 5 shared journal entries

## 📱 Accessibility Features

- **Text-to-speech** for weather forecasts and recommendations
- **High-contrast mode** for visual accessibility
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Responsive design** for mobile devices

## 🌐 API Integration

### Open-Meteo Weather API

```typescript
// Comprehensive weather data fetching
const weatherData = await fetchWeatherData(latitude, longitude);
```

Includes:
- Current conditions
- Hourly forecasts (48 hours)
- Daily forecasts (16 days)
- Air quality data
- Historical averages

### External Service Integration

- **Google Calendar** - Event context for recommendations
- **Strava** - Fitness goals and activity tracking
- **Spoonacular** - Recipe recommendations
- **Google Places** - Local activity discovery

## 🔧 Configuration

### Environment Variables

```env
# API Keys (optional - using public APIs)
VITE_GOOGLE_CALENDAR_API_KEY=your_key_here
VITE_STRAVA_CLIENT_ID=your_client_id_here

# Affiliate Program IDs
VITE_AMAZON_AFFILIATE_TAG=weathersync-20
VITE_NIKE_AFFILIATE_ID=weathersync
```

### Customization

The application supports extensive customization:

- **Weather state thresholds** in `weatherStateMapper.ts`
- **Product recommendations** in `ecommerce.ts`
- **UI themes** via Tailwind CSS classes
- **Badge criteria** in `DecisionJournal.svelte`

## 📊 Analytics & Metrics

### Business Metrics Tracking

```typescript
const revenue = calculateRevenue();
// Returns: totalPurchases, estimatedCommission, topCategories, topStores
```

### User Engagement

- Decision timeline interactions
- Purchase conversion rates
- Badge achievement rates
- Journal entry frequency
- Social sharing activity

## 🚀 Deployment

### Static Site Generation

```bash
npm run build
```

The application builds to static files suitable for deployment on:
- **Vercel** (recommended)
- **Netlify**
- **AWS S3 + CloudFront**
- **GitHub Pages**

### AWS Amplify Configuration

```yaml
# amplify.yml
version: 1
frontend:
  phases:
    preBuild:
      commands:
        - npm ci
    build:
      commands:
        - npm run build
  artifacts:
    baseDirectory: build
    files:
      - '**/*'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Open-Meteo** for comprehensive weather data
- **Leaflet.js** for interactive mapping
- **SvelteKit** for the application framework
- **Tailwind CSS** for styling
- **TypeScript** for type safety

## 📞 Support

For support and questions:
- Create an issue on GitHub
- Check the [documentation](docs/)
- Review the [PRD](WeatherSync%20Decision%20Hub%20MVP%20PRD.markdown)

---

**WeatherSync Decision Hub** - Making weather-informed decisions effortless and engaging! 🌤️✨
