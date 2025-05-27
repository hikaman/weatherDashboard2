// POSTPONED: Weaviate implementation is postponed. This file is currently not in use.
import type { WeatherResponse } from './openMeteo';
import { generateEmbedding } from './embed';
import { weaviateClient } from './weaviate';
import { weatherCodeDescription } from './weatherCodes';

export async function storeWeatherTransitions(weather: WeatherResponse): Promise<void> {
  const { latitude, longitude } = weather;
  const h = weather.hourly;
  for (let i = 1; i < h.time.length; i++) {
    const transition = {
      location: `${latitude},${longitude}`,
      start_time: h.time[i - 1],
      end_time: h.time[i],
      from_weathercode: h.weathercode[i - 1],
      to_weathercode: h.weathercode[i],
      temperature_change: h.temperature_2m[i] - h.temperature_2m[i - 1],
      precipitation_change: h.precipitation[i] - h.precipitation[i - 1],
      uv_index_change: h.uv_index[i] - h.uv_index[i - 1],
      description: `${weatherCodeDescription(h.weathercode[i - 1])} → ${weatherCodeDescription(h.weathercode[i])}`,
    } as const;

    const vector = await generateEmbedding(JSON.stringify(transition));

    await weaviateClient.data.creator()
      .withClassName('WeatherTransition')
      .withProperties({ ...transition, vector })
      .do();
  }
} 