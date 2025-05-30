// POSTPONED: Weaviate implementation is postponed. This file is currently not in use.
import { weaviateClient } from './weaviate';
import { generateEmbedding } from './embed';

interface Recommendation {
  category: string;
  attributes: Record<string, any>;
  suggestion: string;
  conditions?: Record<string, any>;
  transition_conditions?: Record<string, any>;
}

export async function seedRecommendations(): Promise<void> {
  const recs: Recommendation[] = [
    {
      category: 'Clothing',
      attributes: { age_group: 'Adult' },
      suggestion: 'Wear a sun hat',
      conditions: { weathercode: [0, 1, 2], uv_index_min: 3 },
    },
    {
      category: 'Clothing',
      attributes: { age_group: 'Kids' },
      suggestion: 'Put on a rain jacket',
      conditions: { weathercode: [61, 63, 65, 80, 81, 82] },
    },
    {
      category: 'Food',
      attributes: {},
      suggestion: 'Enjoy an ice cream',
      conditions: { temperature_min: 25 },
    },
    {
      category: 'Tip',
      attributes: {},
      suggestion: 'Apply sunscreen',
      conditions: { uv_index_min: 3 },
    },
  ];

  for (const rec of recs) {
    const vector = await generateEmbedding(JSON.stringify({ ...rec.conditions, ...rec.transition_conditions }));
    await weaviateClient.data.creator()
      .withClassName('Recommendation')
      .withProperties({ ...rec, vector })
      .do();
  }
} 