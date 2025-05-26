/**
 * Full mapping of WMO weather codes (0–99) in **German and English**.
 * Source (WMO 4677 Table).
 */

export const WEATHER_CODE_DE: Record<number, string> = {
  /* 0–3 */
  0: 'Klarer Himmel',
  1: 'Überwiegend klar',
  2: 'Teilweise bewölkt',
  3: 'Bedeckt',
  /* 45 / 48 */
  45: 'Nebel',
  48: 'Reifnebel / Nebel mit Raureifablagerung',
  /* 51–57 */
  51: 'Leichter Nieselregen',
  53: 'Mäßiger Nieselregen',
  55: 'Starker Nieselregen',
  56: 'Leichter gefrierender Nieselregen',
  57: 'Starker gefrierender Nieselregen',
  /* 61–67 */
  61: 'Leichter Regen',
  63: 'Mäßiger Regen',
  65: 'Starker Regen',
  66: 'Leichter gefrierender Regen',
  67: 'Starker gefrierender Regen',
  /* 71–77 */
  71: 'Leichter Schneefall',
  73: 'Mäßiger Schneefall',
  75: 'Starker Schneefall',
  77: 'Schneekörner / Schneegriesel',
  /* 80–82 */
  80: 'Leichte Regenschauer',
  81: 'Mäßige Regenschauer',
  82: 'Heftige Regenschauer',
  /* 85–86 */
  85: 'Leichte Schneeschauer',
  86: 'Starke Schneeschauer',
  /* 95 / 96 / 99 */
  95: 'Gewitter',
  96: 'Gewitter mit leichtem Hagel',
  99: 'Gewitter mit schwerem Hagel',
};

export const WEATHER_CODE_EN: Record<number, string> = {
  0: 'Clear sky',
  1: 'Mainly clear',
  2: 'Partly cloudy',
  3: 'Overcast',
  45: 'Fog',
  48: 'Depositing rime fog',
  51: 'Light drizzle',
  53: 'Moderate drizzle',
  55: 'Dense drizzle',
  56: 'Light freezing drizzle',
  57: 'Heavy freezing drizzle',
  61: 'Slight rain',
  63: 'Moderate rain',
  65: 'Heavy rain',
  66: 'Light freezing rain',
  67: 'Heavy freezing rain',
  71: 'Slight snowfall',
  73: 'Moderate snowfall',
  75: 'Heavy snowfall',
  77: 'Snow grains',
  80: 'Slight rain showers',
  81: 'Moderate rain showers',
  82: 'Violent rain showers',
  85: 'Slight snow showers',
  86: 'Heavy snow showers',
  95: 'Thunderstorm',
  96: 'Thunderstorm with slight hail',
  99: 'Thunderstorm with heavy hail',
};

/**
 * Return description for a WMO code.
 * @param code 0–99
 * @param lang 'de' | 'en' (default 'en')
 */
export function weatherCodeDescription(code: number, lang: 'de' | 'en' = 'en'): string {
  return (lang === 'de' ? WEATHER_CODE_DE : WEATHER_CODE_EN)[code] ?? 'Unknown';
} 