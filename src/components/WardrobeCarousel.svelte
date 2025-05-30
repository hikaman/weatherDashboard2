<script lang="ts">
import { weatherStore } from '../stores/weather';
import { t, currentLocale } from '../lib/i18n';
import { derived } from 'svelte/store';

interface WardrobeSuggestion {
  icon: string;
  item: string;
  reason: string;
}

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const wardrobeSuggestions = derived(weatherStore, ($ws) => {
  const temp = $ws.data?.current?.temperature_2m;
  if (temp === undefined) return [];
  const locale = $currentLocale;
  if (temp > 25) {
    return [{
      icon: '👕',
      item: locale === 'de' ? pick([
        'Leichte Sommerklamotten',
        'Luftiges Shirt und Shorts',
        'Kurze Hose & Tank-Top'
      ]) : $t.lightBreathableClothing,
      reason: locale === 'de' ? pick([
        'Die Sonne brennt – gönn dir etwas Luftiges, damit du cool bleibst.',
        'Perfektes Wetter für leichte Stoffe und jede Menge Sonnencreme!',
        'Je weniger Stoff, desto mehr Sommer – genieße die Wärme!'
      ]) : $t.lightBreathableReason
    }];
  } else if (temp > 15) {
    return [{
      icon: '🧥',
      item: locale === 'de' ? pick([
        'Leichte Jacke im Zwiebel-Look',
        'Lieblings-Hoodie & Jeans',
        'Cardigan für den Zwiebel-Style'
      ]) : $t.lightJacketJeans,
      reason: locale === 'de' ? pick([
        'Das klassische "Zwiebel-Look"-Wetter: morgens frisch, nachmittags mild.',
        'Eine Lage mehr schadet nicht – du kannst sie jederzeit abstreifen.',
        'Perfekt für flexible Outfits: Jacke an, Jacke aus, ganz wie du magst.'
      ]) : $t.lightJacketReason
    }];
  } else if (temp > 5) {
    return [{
      icon: '🧶',
      item: locale === 'de' ? pick([
        'Kuschelpullover & warme Hose',
        'Wollpulli mit Lieblingsjeans',
        'Gemütlicher Strick-Look'
      ]) : $t.cozySweaterPants,
      reason: locale === 'de' ? pick([
        'Ein Hauch von Kälte – Zeit, dem inneren Faultier mit einem flauschigen Pulli zu huldigen.',
        'Ideal für heißen Tee und einen richtig gemütlichen Sweater.',
        'Kühl draußen? Kein Problem mit einer Extraportion Strick.'
      ]) : $t.cozySweaterReason
    }];
  } else {
    return [{
      icon: '🧥',
      item: locale === 'de' ? pick([
        'Dicker Wintermantel & Accessoires',
        'Puffer-Jacke plus Mütze',
        'Winterausrüstung komplett'
      ]) : $t.winterCoatAccessories,
      reason: locale === 'de' ? pick([
        'Es ist bitterkalt – zieh alles an, was nicht bei drei auf dem Kleiderbügel ist!',
        'Eisbärenwetter! Pack dich ein und gönn dir eine extra Lage Flausch.',
        'Frostige Luft? Dann heißt es: Schal, Mütze, Handschuhe – das volle Programm.'
      ]) : $t.winterCoatReason
    }];
  }
});
</script>

<div class="wardrobe-carousel glass-card-lg p-4 mb-6" aria-label="Wardrobe Suggestions">
  <h3 class="text-lg font-bold text-glass mb-3 flex items-center">
    <span class="text-xl mr-2">👗</span>
    {$t.wardrobe}
  </h3>
  <div class="carousel flex gap-4 overflow-x-auto pb-2">
    {#each $wardrobeSuggestions as s}
      <div class="wardrobe-card min-w-[200px] max-w-xs bg-white/70 dark:bg-slate-800/60 rounded-xl shadow p-4 flex flex-col items-center justify-center">
        <span class="text-4xl mb-2">{s.icon}</span>
        <span class="font-semibold text-glass text-lg mb-1">{s.item}</span>
        <span class="text-xs text-glass-muted text-center">{s.reason}</span>
      </div>
    {/each}
  </div>
</div>

<style>
.wardrobe-carousel {
  border-radius: 1.5rem;
  box-shadow: 0 2px 12px rgba(30,144,255,0.08);
}
.carousel {
  scrollbar-width: thin;
  scrollbar-color: rgba(30,144,255,0.15) transparent;
}
.carousel::-webkit-scrollbar {
  height: 6px;
}
.carousel::-webkit-scrollbar-thumb {
  background: rgba(30,144,255,0.15);
  border-radius: 3px;
}
.wardrobe-card {
  transition: box-shadow 0.2s, background 0.2s;
}
.wardrobe-card:focus-visible {
  outline: 2px solid #38bdf8;
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(56,189,248,0.3);
}
</style> 