// POSTPONED: Weaviate implementation is postponed. This file is currently not in use.
import { weaviateClient } from './weaviate';
import type { WeatherResponse } from './openMeteo';
import { generateEmbedding } from './embed';
import { weatherCodeDescription } from './weatherCodes';

export async function storeWeatherData(weather: WeatherResponse): Promise<void> {
  const { latitude, longitude } = weather;
  for (let i = 0; i < weather.hourly.time.length; i++) {
    const record = {
      timestamp: weather.hourly.time[i],
      location: `${latitude},${longitude}`,
      temperature: weather.hourly.temperature_2m[i],
      precipitation: weather.hourly.precipitation[i],
      uv_index: weather.hourly.uv_index[i],
      humidity: weather.hourly.humidity[i],
      wind_speed: weather.hourly.wind_speed[i],
      weathercode: weather.hourly.weathercode[i],
      condition: weatherCodeDescription(weather.hourly.weathercode[i]),
    } as const;

    const vector = await generateEmbedding(JSON.stringify(record));

    await weaviateClient.data.creator()
      .withClassName('WeatherData')
      .withProperties({ ...record, vector })
      .do();
  }
} 