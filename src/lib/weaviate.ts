import weaviate, { WeaviateClient, WeaviateClientConfig } from 'weaviate-ts-client';

/**
 * Weaviate client instance (assumes local dev on http://localhost:8080).
 * For production, adjust host / scheme via environment variables.
 */
export const weaviateClient: WeaviateClient = weaviate.client({
  scheme: process.env.WEAVIATE_SCHEME ?? 'http',
  host: process.env.WEAVIATE_HOST ?? 'localhost:8080',
} as WeaviateClientConfig);

/**
 * Classes to (re-)create. Autocreates only when they don't exist.
 */
const SCHEMA_CLASSES = [
  {
    class: 'WeatherData',
    description: 'Hourly weather measurement',
    vectorizer: 'none',
    properties: [
      { name: 'timestamp', dataType: ['date'] },
      { name: 'location', dataType: ['string'] },
      { name: 'temperature', dataType: ['number'] },
      { name: 'precipitation', dataType: ['number'] },
      { name: 'uv_index', dataType: ['number'] },
      { name: 'humidity', dataType: ['number'] },
      { name: 'wind_speed', dataType: ['number'] },
      { name: 'weathercode', dataType: ['int'] },
      { name: 'condition', dataType: ['string'] },
      { name: 'vector', dataType: ['number[]'] },
    ],
  },
  {
    class: 'WeatherTransition',
    description: 'Change between two consecutive hourly measurements',
    vectorizer: 'none',
    properties: [
      { name: 'location', dataType: ['string'] },
      { name: 'start_time', dataType: ['date'] },
      { name: 'end_time', dataType: ['date'] },
      { name: 'from_weathercode', dataType: ['int'] },
      { name: 'to_weathercode', dataType: ['int'] },
      { name: 'temperature_change', dataType: ['number'] },
      { name: 'precipitation_change', dataType: ['number'] },
      { name: 'uv_index_change', dataType: ['number'] },
      { name: 'description', dataType: ['string'] },
      { name: 'vector', dataType: ['number[]'] },
    ],
  },
  {
    class: 'Recommendation',
    description: 'Suggestion linked to specific weather conditions',
    vectorizer: 'none',
    properties: [
      { name: 'category', dataType: ['string'] },
      { name: 'attributes', dataType: ['object'] },
      { name: 'suggestion', dataType: ['string'] },
      { name: 'conditions', dataType: ['object'] },
      { name: 'transition_conditions', dataType: ['object'] },
      { name: 'vector', dataType: ['number[]'] },
    ],
  },
];

export async function initSchema(): Promise<void> {
  const existing = await weaviateClient.schema.getter().do();
  const existingClasses = new Set(existing.classes?.map((c: any) => c.class) ?? []);

  for (const cls of SCHEMA_CLASSES) {
    if (!existingClasses.has(cls.class)) {
      // @ts-ignore – weaviate type mismatch
      await weaviateClient.schema.classCreator().withClass(cls).do();
      console.log(`Created Weaviate class: ${cls.class}`);
    }
  }
} 