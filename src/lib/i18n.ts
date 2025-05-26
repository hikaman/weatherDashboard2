import { writable } from 'svelte/store';

export type Locale = 'en' | 'de';

export interface Translations {
	// General
	loading: string;
	error: string;
	noData: string;
	
	// Location & Search
	currentLocation: string;
	searchLocation: string;
	enterCityName: string;
	typeToSearch: string;
	noCitiesFound: string;
	
	// Weather Display
	currentWeather: string;
	temperature: string;
	humidity: string;
	windSpeed: string;
	precipitation: string;
	feelsLike: string;
	
	// Time & Date
	today: string;
	tomorrow: string;
	
	// Days of week
	monday: string;
	tuesday: string;
	wednesday: string;
	thursday: string;
	friday: string;
	saturday: string;
	sunday: string;
	
	// Weather conditions
	clearSky: string;
	mainlyClear: string;
	partlyCloudy: string;
	overcast: string;
	fog: string;
	depositingRimeFog: string;
	lightDrizzle: string;
	moderateDrizzle: string;
	denseDrizzle: string;
	slightRain: string;
	moderateRain: string;
	heavyRain: string;
	slightSnowFall: string;
	moderateSnowFall: string;
	heavySnowFall: string;
	slightRainShowers: string;
	moderateRainShowers: string;
	violentRainShowers: string;
	thunderstorm: string;
	
	// Forecast sections
	hourlyForecast: string;
	hourlyForecastTitle: string;
	noHourlyData: string;
	hourlyDataUnavailable: string;
	precipitationChance: string;
	
	// Suggestions
	smartSuggestions: string;
	noSuggestionsData: string;
	
	// Suggestion categories
	wardrobe: string;
	food: string;
	activity: string;
	exercise: string;
	
	// Wardrobe suggestions
	lightBreathableClothing: string;
	lightBreathableReason: string;
	lightJacketJeans: string;
	lightJacketReason: string;
	cozySweaterPants: string;
	cozySweaterReason: string;
	winterCoatAccessories: string;
	winterCoatReason: string;
	
	// Food suggestions
	freshSaladColdSoup: string;
	freshSaladReason: string;
	sandwichLightMeal: string;
	sandwichReason: string;
	warmSoupStew: string;
	warmSoupReason: string;
	hotDrinksComfortFood: string;
	hotDrinksReason: string;
	
	// Activity suggestions
	indoorActivities: string;
	indoorActivitiesReason: string;
	outdoorAdventures: string;
	outdoorAdventuresReason: string;
	lightOutdoorActivities: string;
	lightOutdoorReason: string;
	cozyIndoorTime: string;
	cozyIndoorReason: string;
	
	// Exercise suggestions
	swimmingWaterActivities: string;
	swimmingReason: string;
	cyclingJogging: string;
	cyclingReason: string;
	briskWalking: string;
	briskWalkingReason: string;
	indoorYogaStretching: string;
	indoorYogaReason: string;
	
	// Weather alerts
	weatherDataUnavailable: string;
	
	// Legend
	precipitationChanceLegend: string;
	windSpeedLegend: string;
	temperatureLegend: string;
	
	// Additional UI text
	sevenDayForecast: string;
	noWeatherDataMessage: string;
}

const translations: Record<Locale, Translations> = {
	en: {
		// General
		loading: 'Loading weather data...',
		error: 'Error',
		noData: 'No data available',
		
		// Location & Search
		currentLocation: 'Current Location',
		searchLocation: 'Search Location',
		enterCityName: 'Enter city name...',
		typeToSearch: 'Type at least 2 characters to search for cities',
		noCitiesFound: 'No cities found for',
		
		// Weather Display
		currentWeather: 'Current Weather',
		temperature: 'Temperature',
		humidity: 'Humidity',
		windSpeed: 'Wind Speed',
		precipitation: 'Precipitation',
		feelsLike: 'Feels like',
		
		// Time & Date
		today: 'Today',
		tomorrow: 'Tomorrow',
		
		// Days of week
		monday: 'Mon',
		tuesday: 'Tue',
		wednesday: 'Wed',
		thursday: 'Thu',
		friday: 'Fri',
		saturday: 'Sat',
		sunday: 'Sun',
		
		// Weather conditions
		clearSky: 'Clear sky',
		mainlyClear: 'Mainly clear',
		partlyCloudy: 'Partly cloudy',
		overcast: 'Overcast',
		fog: 'Fog',
		depositingRimeFog: 'Depositing rime fog',
		lightDrizzle: 'Light drizzle',
		moderateDrizzle: 'Moderate drizzle',
		denseDrizzle: 'Dense drizzle',
		slightRain: 'Slight rain',
		moderateRain: 'Moderate rain',
		heavyRain: 'Heavy rain',
		slightSnowFall: 'Slight snow fall',
		moderateSnowFall: 'Moderate snow fall',
		heavySnowFall: 'Heavy snow fall',
		slightRainShowers: 'Slight rain showers',
		moderateRainShowers: 'Moderate rain showers',
		violentRainShowers: 'Violent rain showers',
		thunderstorm: 'Thunderstorm',
		
		// Forecast sections
		hourlyForecast: '24-Hour Forecast',
		hourlyForecastTitle: '24-Hour Forecast',
		noHourlyData: 'No Hourly Data',
		hourlyDataUnavailable: 'Hourly forecast data is not available.',
		precipitationChance: 'Precipitation chance',
		
		// Suggestions
		smartSuggestions: 'Smart Suggestions',
		noSuggestionsData: 'No weather data available for suggestions',
		
		// Suggestion categories
		wardrobe: 'Wardrobe',
		food: 'Food',
		activity: 'Activity',
		exercise: 'Exercise',
		
		// Wardrobe suggestions
		lightBreathableClothing: 'Light, breathable clothing',
		lightBreathableReason: 'Perfect weather for staying cool and comfortable in light fabrics.',
		lightJacketJeans: 'Light jacket and jeans',
		lightJacketReason: 'Ideal layering weather - comfortable and adaptable to temperature changes.',
		cozySweaterPants: 'Cozy sweater and warm pants',
		cozySweaterReason: 'Bundle up in something warm and comfortable for this cooler weather.',
		winterCoatAccessories: 'Winter coat and accessories',
		winterCoatReason: 'Layer up well - cold enough that you will appreciate the extra warmth.',
		
		// Food suggestions
		freshSaladColdSoup: 'Fresh salad or cold soup',
		freshSaladReason: 'Light, refreshing meals are perfect for staying energized in warm weather.',
		sandwichLightMeal: 'Sandwich or light meal',
		sandwichReason: 'Great weather for outdoor eating or a satisfying, balanced meal.',
		warmSoupStew: 'Warm soup or stew',
		warmSoupReason: 'Nothing beats a hearty, warming meal when the weather turns cooler.',
		hotDrinksComfortFood: 'Hot drinks and comfort food',
		hotDrinksReason: 'Warm up from the inside with comforting hot meals and beverages.',
		
		// Activity suggestions
		indoorActivities: 'Indoor activities',
		indoorActivitiesReason: 'Perfect weather for museums, cafes, or cozy indoor entertainment.',
		outdoorAdventures: 'Outdoor adventures',
		outdoorAdventuresReason: 'Beautiful conditions for hiking, picnics, or exploring nature.',
		lightOutdoorActivities: 'Light outdoor activities',
		lightOutdoorReason: 'Great weather for walking, light exercise, or outdoor markets.',
		cozyIndoorTime: 'Cozy indoor time',
		cozyIndoorReason: 'Perfect weather for staying warm indoors with books, movies, or hobbies.',
		
		// Exercise suggestions
		swimmingWaterActivities: 'Swimming or water activities',
		swimmingReason: 'Beat the heat with refreshing water-based exercise and activities.',
		cyclingJogging: 'Cycling or jogging',
		cyclingReason: 'Perfect conditions for energizing outdoor cardio and fresh air.',
		briskWalking: 'Brisk walking',
		briskWalkingReason: 'Great weather for a refreshing walk to get your blood flowing.',
		indoorYogaStretching: 'Indoor yoga or stretching',
		indoorYogaReason: 'Stay active and warm with gentle indoor movement and mindfulness.',
		
		// Weather alerts
		weatherDataUnavailable: 'Weather Data Unavailable',
		
		// Legend
		precipitationChanceLegend: 'Precipitation chance',
		windSpeedLegend: 'Wind speed',
		temperatureLegend: 'Temperature',
		
		// Additional UI text
		sevenDayForecast: '7-Day Forecast',
		noWeatherDataMessage: 'Search for a city or allow location access to see weather information.',
	},
	de: {
		// General
		loading: 'Wetterdaten werden geladen...',
		error: 'Fehler',
		noData: 'Keine Daten verfügbar',
		
		// Location & Search
		currentLocation: 'Aktueller Standort',
		searchLocation: 'Standort suchen',
		enterCityName: 'Stadtname eingeben...',
		typeToSearch: 'Mindestens 2 Zeichen eingeben, um nach Städten zu suchen',
		noCitiesFound: 'Keine Städte gefunden für',
		
		// Weather Display
		currentWeather: 'Aktuelles Wetter',
		temperature: 'Temperatur',
		humidity: 'Luftfeuchtigkeit',
		windSpeed: 'Windgeschwindigkeit',
		precipitation: 'Niederschlag',
		feelsLike: 'Gefühlt wie',
		
		// Time & Date
		today: 'Heute',
		tomorrow: 'Morgen',
		
		// Days of week
		monday: 'Mo',
		tuesday: 'Di',
		wednesday: 'Mi',
		thursday: 'Do',
		friday: 'Fr',
		saturday: 'Sa',
		sunday: 'So',
		
		// Weather conditions
		clearSky: 'Klarer Himmel',
		mainlyClear: 'Überwiegend klar',
		partlyCloudy: 'Teilweise bewölkt',
		overcast: 'Bedeckt',
		fog: 'Nebel',
		depositingRimeFog: 'Reifnebel',
		lightDrizzle: 'Leichter Nieselregen',
		moderateDrizzle: 'Mäßiger Nieselregen',
		denseDrizzle: 'Starker Nieselregen',
		slightRain: 'Leichter Regen',
		moderateRain: 'Mäßiger Regen',
		heavyRain: 'Starker Regen',
		slightSnowFall: 'Leichter Schneefall',
		moderateSnowFall: 'Mäßiger Schneefall',
		heavySnowFall: 'Starker Schneefall',
		slightRainShowers: 'Leichte Regenschauer',
		moderateRainShowers: 'Mäßige Regenschauer',
		violentRainShowers: 'Heftige Regenschauer',
		thunderstorm: 'Gewitter',
		
		// Forecast sections
		hourlyForecast: '24-Stunden-Vorhersage',
		hourlyForecastTitle: '24-Stunden-Vorhersage',
		noHourlyData: 'Keine Stundendaten',
		hourlyDataUnavailable: 'Stündliche Vorhersagedaten sind nicht verfügbar.',
		precipitationChance: 'Regenwahrscheinlichkeit',
		
		// Suggestions
		smartSuggestions: 'Intelligente Empfehlungen',
		noSuggestionsData: 'Keine Wetterdaten für Empfehlungen verfügbar',
		
		// Suggestion categories
		wardrobe: 'Kleidung',
		food: 'Essen',
		activity: 'Aktivität',
		exercise: 'Sport',
		
		// Wardrobe suggestions
		lightBreathableClothing: 'Leichte, atmungsaktive Kleidung',
		lightBreathableReason: 'Perfektes Wetter, um in leichten Stoffen kühl und bequem zu bleiben.',
		lightJacketJeans: 'Leichte Jacke und Jeans',
		lightJacketReason: 'Ideales Schichtwetter - bequem und anpassbar an Temperaturschwankungen.',
		cozySweaterPants: 'Gemütlicher Pullover und warme Hose',
		cozySweaterReason: 'Ziehen Sie sich warm und bequem an für dieses kühlere Wetter.',
		winterCoatAccessories: 'Wintermantel und Accessoires',
		winterCoatReason: 'Ziehen Sie sich warm an - es ist kalt genug, dass Sie die extra Wärme schätzen werden.',
		
		// Food suggestions
		freshSaladColdSoup: 'Frischer Salat oder kalte Suppe',
		freshSaladReason: 'Leichte, erfrischende Mahlzeiten sind perfekt, um bei warmem Wetter energiegeladen zu bleiben.',
		sandwichLightMeal: 'Sandwich oder leichte Mahlzeit',
		sandwichReason: 'Tolles Wetter zum Draußen essen oder für eine sättigende, ausgewogene Mahlzeit.',
		warmSoupStew: 'Warme Suppe oder Eintopf',
		warmSoupReason: 'Nichts geht über eine herzhafte, wärmende Mahlzeit, wenn das Wetter kühler wird.',
		hotDrinksComfortFood: 'Heiße Getränke und Comfort Food',
		hotDrinksReason: 'Wärmen Sie sich von innen mit wohltuenden heißen Mahlzeiten und Getränken auf.',
		
		// Activity suggestions
		indoorActivities: 'Indoor-Aktivitäten',
		indoorActivitiesReason: 'Perfektes Wetter für Museen, Cafés oder gemütliche Indoor-Unterhaltung.',
		outdoorAdventures: 'Outdoor-Abenteuer',
		outdoorAdventuresReason: 'Wunderschöne Bedingungen zum Wandern, Picknicken oder die Natur erkunden.',
		lightOutdoorActivities: 'Leichte Outdoor-Aktivitäten',
		lightOutdoorReason: 'Tolles Wetter zum Spazierengehen, leichten Sport oder Outdoor-Märkte besuchen.',
		cozyIndoorTime: 'Gemütliche Zeit drinnen',
		cozyIndoorReason: 'Perfektes Wetter, um es sich drinnen mit Büchern, Filmen oder Hobbys gemütlich zu machen.',
		
		// Exercise suggestions
		swimmingWaterActivities: 'Schwimmen oder Wasseraktivitäten',
		swimmingReason: 'Bekämpfen Sie die Hitze mit erfrischenden wasserbasierten Übungen und Aktivitäten.',
		cyclingJogging: 'Radfahren oder Joggen',
		cyclingReason: 'Perfekte Bedingungen für energiegeladenes Outdoor-Cardio und frische Luft.',
		briskWalking: 'Zügiges Gehen',
		briskWalkingReason: 'Tolles Wetter für einen erfrischenden Spaziergang, um den Kreislauf in Schwung zu bringen.',
		indoorYogaStretching: 'Indoor-Yoga oder Stretching',
		indoorYogaReason: 'Bleiben Sie aktiv und warm mit sanften Indoor-Bewegungen und Achtsamkeit.',
		
		// Weather alerts
		weatherDataUnavailable: 'Wetterdaten nicht verfügbar',
		
		// Legend
		precipitationChanceLegend: 'Regenwahrscheinlichkeit',
		windSpeedLegend: 'Windgeschwindigkeit',
		temperatureLegend: 'Temperatur',
		
		// Additional UI text
		sevenDayForecast: '7-Tage-Vorhersage',
		noWeatherDataMessage: 'Suchen Sie nach einer Stadt oder erlauben Sie Standortzugriff, um Wetterinformationen zu sehen.',
	}
};

// Current locale store
export const currentLocale = writable<Locale>('de'); // Default to German

// Current translations store
export const t = writable<Translations>(translations.de);

// Function to change locale
export function setLocale(locale: Locale) {
	currentLocale.set(locale);
	t.set(translations[locale]);
	
	// Store preference in localStorage
	if (typeof window !== 'undefined') {
		localStorage.setItem('weatherwise-locale', locale);
	}
}

// Initialize locale from localStorage or browser preference
export function initLocale() {
	if (typeof window !== 'undefined') {
		const stored = localStorage.getItem('weatherwise-locale') as Locale;
		if (stored && translations[stored]) {
			setLocale(stored);
			return;
		}
		
		// Check browser language
		const browserLang = navigator.language.toLowerCase();
		if (browserLang.startsWith('de')) {
			setLocale('de');
		} else {
			setLocale('en');
		}
	}
}

// Helper function to get translation
export function getTranslation(key: keyof Translations, locale: Locale = 'de'): string {
	return translations[locale][key];
} 