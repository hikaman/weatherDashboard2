import { initSchema } from '../src/lib/weaviate';
import { seedRecommendations } from '../src/lib/recommendations';

(async () => {
  await initSchema();
  await seedRecommendations();
  console.log('Weaviate schema initialised and recommendations seeded.');
})(); 