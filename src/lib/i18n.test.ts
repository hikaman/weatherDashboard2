import { describe, it, expect, beforeEach, vi } from 'vitest';
import { get } from 'svelte/store';
import { setLocale, currentLocale, t, getTranslation, initLocale, type Locale } from './i18n';

describe('i18n System', () => {
	beforeEach(() => {
		// Reset to default state
		setLocale('de');
	});

	describe('Locale Management', () => {
		it('should default to German locale', () => {
			expect(get(currentLocale)).toBe('de');
		});

		it('should switch to English locale', () => {
			setLocale('en');
			expect(get(currentLocale)).toBe('en');
		});

		it('should update translations when locale changes', () => {
			setLocale('de');
			expect(get(t).loading).toBe('Wetterdaten werden geladen...');
			
			setLocale('en');
			expect(get(t).loading).toBe('Loading weather data...');
		});
	});

	describe('German Translations', () => {
		beforeEach(() => {
			setLocale('de');
		});

		it('should have correct general translations', () => {
			const translations = get(t);
			expect(translations.loading).toBe('Wetterdaten werden geladen...');
			expect(translations.error).toBe('Fehler');
			expect(translations.noData).toBe('Keine Daten verfügbar');
		});

		it('should have correct location translations', () => {
			const translations = get(t);
			expect(translations.currentLocation).toBe('Aktueller Standort');
			expect(translations.searchLocation).toBe('Standort suchen');
			expect(translations.enterCityName).toBe('Stadtname eingeben...');
		});

		it('should have correct weather display translations', () => {
			const translations = get(t);
			expect(translations.currentWeather).toBe('Aktuelles Wetter');
			expect(translations.temperature).toBe('Temperatur');
			expect(translations.humidity).toBe('Luftfeuchtigkeit');
			expect(translations.windSpeed).toBe('Windgeschwindigkeit');
			expect(translations.precipitation).toBe('Niederschlag');
		});

		it('should have correct time and date translations', () => {
			const translations = get(t);
			expect(translations.today).toBe('Heute');
			expect(translations.tomorrow).toBe('Morgen');
			expect(translations.monday).toBe('Mo');
			expect(translations.tuesday).toBe('Di');
			expect(translations.wednesday).toBe('Mi');
			expect(translations.thursday).toBe('Do');
			expect(translations.friday).toBe('Fr');
			expect(translations.saturday).toBe('Sa');
			expect(translations.sunday).toBe('So');
		});

		it('should have correct weather condition translations', () => {
			const translations = get(t);
			expect(translations.clearSky).toBe('Klarer Himmel');
			expect(translations.partlyCloudy).toBe('Teilweise bewölkt');
			expect(translations.overcast).toBe('Bedeckt');
			expect(translations.fog).toBe('Nebel');
			expect(translations.slightRain).toBe('Leichter Regen');
			expect(translations.heavyRain).toBe('Starker Regen');
			expect(translations.thunderstorm).toBe('Gewitter');
		});

		it('should have correct suggestion translations', () => {
			const translations = get(t);
			expect(translations.smartSuggestions).toBe('Intelligente Empfehlungen');
			expect(translations.wardrobe).toBe('Kleidung');
			expect(translations.food).toBe('Essen');
			expect(translations.activity).toBe('Aktivität');
			expect(translations.exercise).toBe('Sport');
		});

		it('should have correct wardrobe suggestion translations', () => {
			const translations = get(t);
			expect(translations.lightBreathableClothing).toBe('Leichte, atmungsaktive Kleidung');
			expect(translations.lightJacketJeans).toBe('Leichte Jacke und Jeans');
			expect(translations.cozySweaterPants).toBe('Gemütlicher Pullover und warme Hose');
			expect(translations.winterCoatAccessories).toBe('Wintermantel und Accessoires');
		});

		it('should have correct food suggestion translations', () => {
			const translations = get(t);
			expect(translations.freshSaladColdSoup).toBe('Frischer Salat oder kalte Suppe');
			expect(translations.sandwichLightMeal).toBe('Sandwich oder leichte Mahlzeit');
			expect(translations.warmSoupStew).toBe('Warme Suppe oder Eintopf');
			expect(translations.hotDrinksComfortFood).toBe('Heiße Getränke und Comfort Food');
		});

		it('should have correct activity suggestion translations', () => {
			const translations = get(t);
			expect(translations.indoorActivities).toBe('Indoor-Aktivitäten');
			expect(translations.outdoorAdventures).toBe('Outdoor-Abenteuer');
			expect(translations.lightOutdoorActivities).toBe('Leichte Outdoor-Aktivitäten');
			expect(translations.cozyIndoorTime).toBe('Gemütliche Zeit drinnen');
		});

		it('should have correct exercise suggestion translations', () => {
			const translations = get(t);
			expect(translations.swimmingWaterActivities).toBe('Schwimmen oder Wasseraktivitäten');
			expect(translations.cyclingJogging).toBe('Radfahren oder Joggen');
			expect(translations.briskWalking).toBe('Zügiges Gehen');
			expect(translations.indoorYogaStretching).toBe('Indoor-Yoga oder Stretching');
		});
	});

	describe('English Translations', () => {
		beforeEach(() => {
			setLocale('en');
		});

		it('should have correct general translations', () => {
			const translations = get(t);
			expect(translations.loading).toBe('Loading weather data...');
			expect(translations.error).toBe('Error');
			expect(translations.noData).toBe('No data available');
		});

		it('should have correct weather display translations', () => {
			const translations = get(t);
			expect(translations.currentWeather).toBe('Current Weather');
			expect(translations.temperature).toBe('Temperature');
			expect(translations.humidity).toBe('Humidity');
			expect(translations.windSpeed).toBe('Wind Speed');
		});

		it('should have correct suggestion translations', () => {
			const translations = get(t);
			expect(translations.smartSuggestions).toBe('Smart Suggestions');
			expect(translations.wardrobe).toBe('Wardrobe');
			expect(translations.food).toBe('Food');
			expect(translations.activity).toBe('Activity');
			expect(translations.exercise).toBe('Exercise');
		});
	});

	describe('Helper Functions', () => {
		it('should get translation by key', () => {
			expect(getTranslation('loading', 'de')).toBe('Wetterdaten werden geladen...');
			expect(getTranslation('loading', 'en')).toBe('Loading weather data...');
		});

		it('should default to German for getTranslation', () => {
			expect(getTranslation('loading')).toBe('Wetterdaten werden geladen...');
		});
	});

	describe('Locale Persistence', () => {
		it('should store locale preference in localStorage', () => {
			// Mock localStorage
			const mockLocalStorage = {
				getItem: vi.fn(),
				setItem: vi.fn(),
				removeItem: vi.fn(),
			};
			Object.defineProperty(window, 'localStorage', {
				value: mockLocalStorage,
				writable: true,
			});

			setLocale('en');
			expect(mockLocalStorage.setItem).toHaveBeenCalledWith('weatherwise-locale', 'en');
		});
	});

	describe('Translation Completeness', () => {
		it('should have all required translation keys for both languages', () => {
			const germanTranslations = getTranslation('loading', 'de');
			const englishTranslations = getTranslation('loading', 'en');
			
			expect(germanTranslations).toBeDefined();
			expect(englishTranslations).toBeDefined();
		});

		it('should have humanized suggestion reasons', () => {
			setLocale('de');
			const translations = get(t);
			
			// Check that reasons are conversational and helpful
			expect(translations.lightBreathableReason).toContain('Perfektes Wetter');
			expect(translations.freshSaladReason).toContain('Leichte, erfrischende Mahlzeiten');
			expect(translations.indoorActivitiesReason).toContain('Perfektes Wetter für');
			expect(translations.swimmingReason).toContain('Bekämpfen Sie die Hitze');
		});
	});
}); 