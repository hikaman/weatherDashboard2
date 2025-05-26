<script lang="ts">
	import { currentLocale, setLocale, type Locale } from '../lib/i18n';

	function toggleLanguage() {
		const newLocale: Locale = $currentLocale === 'de' ? 'en' : 'de';
		setLocale(newLocale);
	}
</script>

<button
	on:click={toggleLanguage}
	class="glass-button px-3 py-2 rounded-glass text-sm font-medium text-glass hover:bg-white/40 dark:hover:bg-slate-800/50 transition-all duration-200 flex items-center gap-2"
	aria-label="Toggle language"
>
	<span class="text-lg">
		{#if $currentLocale === 'de'}
			🇩🇪
		{:else}
			🇺🇸
		{/if}
	</span>
	<span class="hidden sm:inline">
		{$currentLocale === 'de' ? 'Deutsch' : 'English'}
	</span>
</button>

<style>
	.glass-button:hover {
		backdrop-filter: blur(20px);
		-webkit-backdrop-filter: blur(20px);
	}
</style> 