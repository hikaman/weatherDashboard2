import { pipeline } from '@xenova/transformers';

let extractor: any; // cached model

/**
 * Generate a normalized embedding (float32 array) for arbitrary text.
 */
export async function generateEmbedding(text: string): Promise<number[]> {
  extractor ??= await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
  const res = await extractor(text, { pooling: 'mean', normalize: true });
  return Array.from(res.data as Float32Array);
} 