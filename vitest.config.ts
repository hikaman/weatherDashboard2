import { defineConfig } from 'vitest/config';

export default defineConfig({
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
		exclude: ['src/**/*.svelte'],
		environment: 'jsdom',
		setupFiles: ['./src/test-setup.ts'],
		globals: true,
		coverage: {
			reporter: ['text', 'json', 'html'],
			exclude: [
				'node_modules/',
				'src/test-setup.ts',
				'src/**/*.svelte',
			]
		}
	}
}); 