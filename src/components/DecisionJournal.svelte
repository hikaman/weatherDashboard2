<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  interface JournalEntry {
    id: string;
    date: string;
    weatherState: string;
    decisions: {
      wardrobe: string;
      fitness: string;
      meal: string;
      activity: string;
    };
    purchases: {
      item: string;
      store: string;
      price?: string;
    }[];
    badges: string[];
    rating: number;
    notes?: string;
  }

  interface Badge {
    id: string;
    name: string;
    emoji: string;
    description: string;
    earned: boolean;
    earnedDate?: string;
  }

  let journalEntries: JournalEntry[] = [];
  let availableBadges: Badge[] = [];
  let selectedEntry: JournalEntry | null = null;
  let showAddEntry = false;

  // Initialize badges
  function initializeBadges() {
    availableBadges = [
      {
        id: 'rainy-explorer',
        name: 'Rainy Explorer',
        emoji: '🌧️',
        description: 'Attended 5 rainy weather activities',
        earned: false
      },
      {
        id: 'sunny-adventurer',
        name: 'Sunny Adventurer',
        emoji: '☀️',
        description: 'Completed 10 sunny day activities',
        earned: false
      },
      {
        id: 'showery-yogi',
        name: 'Showery Yogi',
        emoji: '🧘',
        description: 'Did indoor yoga during showery weather',
        earned: false
      },
      {
        id: 'weather-wise',
        name: 'Weather Wise',
        emoji: '🧠',
        description: 'Made 20 weather-informed decisions',
        earned: false
      },
      {
        id: 'fashion-forward',
        name: 'Fashion Forward',
        emoji: '👗',
        description: 'Purchased 5 weather-appropriate clothing items',
        earned: false
      },
      {
        id: 'fitness-fanatic',
        name: 'Fitness Fanatic',
        emoji: '💪',
        description: 'Completed 15 weather-adapted workouts',
        earned: false
      },
      {
        id: 'foodie-forecaster',
        name: 'Foodie Forecaster',
        emoji: '🍽️',
        description: 'Tried 10 weather-inspired meals',
        earned: false
      },
      {
        id: 'social-butterfly',
        name: 'Social Butterfly',
        emoji: '🦋',
        description: 'Shared 5 journal entries on social media',
        earned: false
      }
    ];
  }

  // Load data from localStorage
  function loadJournalData() {
    if (!browser) return;

    try {
      const savedEntries = localStorage.getItem('weatherJournalEntries');
      const savedBadges = localStorage.getItem('weatherJournalBadges');

      if (savedEntries) {
        journalEntries = JSON.parse(savedEntries);
      }

      if (savedBadges) {
        const badgeData = JSON.parse(savedBadges);
        availableBadges = availableBadges.map(badge => ({
          ...badge,
          ...badgeData.find((b: any) => b.id === badge.id)
        }));
      }
    } catch (error) {
      console.error('Error loading journal data:', error);
    }
  }

  // Save data to localStorage
  function saveJournalData() {
    if (!browser) return;

    try {
      localStorage.setItem('weatherJournalEntries', JSON.stringify(journalEntries));
      localStorage.setItem('weatherJournalBadges', JSON.stringify(availableBadges));
    } catch (error) {
      console.error('Error saving journal data:', error);
    }
  }

  // Add a new journal entry
  function addJournalEntry() {
    const newEntry: JournalEntry = {
      id: Date.now().toString(),
      date: new Date().toISOString().split('T')[0],
      weatherState: 'Sunny', // This would come from current weather
      decisions: {
        wardrobe: 'Comfortable t-shirt and jeans',
        fitness: 'Morning jog in the park',
        meal: 'Fresh salad for lunch',
        activity: 'Outdoor farmers market'
      },
      purchases: [],
      badges: [],
      rating: 5,
      notes: ''
    };

    journalEntries = [newEntry, ...journalEntries];
    selectedEntry = newEntry;
    showAddEntry = false;
    checkForNewBadges();
    saveJournalData();
  }

  // Check if user earned new badges
  function checkForNewBadges() {
    const updates: Badge[] = [];

    // Weather Wise badge
    if (journalEntries.length >= 20 && !availableBadges.find(b => b.id === 'weather-wise')?.earned) {
      const badge = availableBadges.find(b => b.id === 'weather-wise');
      if (badge) {
        badge.earned = true;
        badge.earnedDate = new Date().toISOString().split('T')[0];
        updates.push(badge);
      }
    }

    // Rainy Explorer badge
    const rainyEntries = journalEntries.filter(e => e.weatherState.includes('Rainy') || e.weatherState.includes('Showery'));
    if (rainyEntries.length >= 5 && !availableBadges.find(b => b.id === 'rainy-explorer')?.earned) {
      const badge = availableBadges.find(b => b.id === 'rainy-explorer');
      if (badge) {
        badge.earned = true;
        badge.earnedDate = new Date().toISOString().split('T')[0];
        updates.push(badge);
      }
    }

    // Fashion Forward badge
    const totalPurchases = journalEntries.reduce((sum, entry) => sum + entry.purchases.length, 0);
    if (totalPurchases >= 5 && !availableBadges.find(b => b.id === 'fashion-forward')?.earned) {
      const badge = availableBadges.find(b => b.id === 'fashion-forward');
      if (badge) {
        badge.earned = true;
        badge.earnedDate = new Date().toISOString().split('T')[0];
        updates.push(badge);
      }
    }

    if (updates.length > 0) {
      // Show badge notification (simplified)
      console.log('New badges earned:', updates.map(b => b.name));
    }
  }

  // Share entry on social media
  function shareEntry(entry: JournalEntry) {
    const text = `Just made some great weather-informed decisions! ${entry.weatherState} weather led me to: ${entry.decisions.activity}. Loving my WeatherSync Decision Hub! #WeatherWise #SmartDecisions`;
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');
  }

  // Format date for display
  function formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  // Get weather state emoji
  function getWeatherEmoji(state: string): string {
    const emojiMap: Record<string, string> = {
      'Sunny': '☀️',
      'Hot_Sunny': '🔥',
      'Showery': '🌦️',
      'Rainy': '🌧️',
      'Cloudy': '☁️',
      'Cold': '🥶',
      'Stormy': '⛈️'
    };
    return emojiMap[state] || '🌤️';
  }

  onMount(() => {
    initializeBadges();
    loadJournalData();
  });

  // Auto-save when data changes
  $: if (browser && journalEntries.length > 0) {
    saveJournalData();
  }
</script>

<div class="weather-card">
  <div class="flex items-center justify-between mb-6">
    <h2 class="text-xl font-bold text-gray-900 dark:text-white flex items-center">
      <span class="text-2xl mr-3">📔</span>
      Decision Journal
    </h2>
    <button
      on:click={() => showAddEntry = true}
      class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
    >
      + Add Entry
    </button>
  </div>

  <!-- Badges Section -->
  <div class="mb-8">
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <span class="text-xl mr-2">🏆</span>
      Achievements
    </h3>
    
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3">
      {#each availableBadges as badge}
        <div class="badge-card p-3 rounded-lg border {badge.earned ? 'bg-yellow-50 border-yellow-300 dark:bg-yellow-900/20 dark:border-yellow-700' : 'bg-gray-50 border-gray-200 dark:bg-gray-800 dark:border-gray-700'} text-center">
          <div class="text-2xl mb-1 {badge.earned ? '' : 'grayscale opacity-50'}">{badge.emoji}</div>
          <div class="text-xs font-semibold {badge.earned ? 'text-yellow-800 dark:text-yellow-200' : 'text-gray-600 dark:text-gray-400'}">{badge.name}</div>
          <div class="text-xs text-gray-500 dark:text-gray-400 mt-1">{badge.description}</div>
          {#if badge.earned && badge.earnedDate}
            <div class="text-xs text-green-600 dark:text-green-400 mt-1">Earned {formatDate(badge.earnedDate)}</div>
          {/if}
        </div>
      {/each}
    </div>
  </div>

  <!-- Journal Entries -->
  <div>
    <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
      <span class="text-xl mr-2">📝</span>
      Recent Entries
    </h3>

    {#if journalEntries.length === 0}
      <div class="text-center py-8">
        <div class="text-gray-400 text-4xl mb-3">📖</div>
        <p class="text-gray-600 dark:text-gray-400 mb-4">No journal entries yet</p>
        <button
          on:click={() => showAddEntry = true}
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Your First Entry
        </button>
      </div>
    {:else}
      <div class="space-y-4">
        {#each journalEntries.slice(0, 5) as entry}
          <div class="journal-entry p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow">
            <div class="flex items-start justify-between mb-3">
              <div class="flex items-center space-x-3">
                <span class="text-2xl">{getWeatherEmoji(entry.weatherState)}</span>
                <div>
                  <h4 class="font-semibold text-gray-900 dark:text-white">{formatDate(entry.date)}</h4>
                  <p class="text-sm text-gray-600 dark:text-gray-400">{entry.weatherState} Weather</p>
                </div>
              </div>
              <div class="flex items-center space-x-2">
                <!-- Rating -->
                <div class="flex items-center space-x-1">
                  {#each Array(5) as _, i}
                    <span class="text-sm {i < entry.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}">⭐</span>
                  {/each}
                </div>
                <!-- Share button -->
                <button
                  on:click={() => shareEntry(entry)}
                  class="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                  title="Share on X"
                  aria-label="Share journal entry on X (Twitter)"
                >
                  <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                  </svg>
                </button>
              </div>
            </div>

            <!-- Decisions Grid -->
            <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mb-3">
              <div class="decision-item">
                <div class="text-xs font-medium text-purple-700 dark:text-purple-300">👗 Wardrobe</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{entry.decisions.wardrobe}</div>
              </div>
              <div class="decision-item">
                <div class="text-xs font-medium text-green-700 dark:text-green-300">💪 Fitness</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{entry.decisions.fitness}</div>
              </div>
              <div class="decision-item">
                <div class="text-xs font-medium text-orange-700 dark:text-orange-300">🍽️ Meal</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{entry.decisions.meal}</div>
              </div>
              <div class="decision-item">
                <div class="text-xs font-medium text-blue-700 dark:text-blue-300">🎯 Activity</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{entry.decisions.activity}</div>
              </div>
            </div>

            <!-- Purchases -->
            {#if entry.purchases.length > 0}
              <div class="purchases-section mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-2">🛍️ Purchases</div>
                <div class="flex flex-wrap gap-2">
                  {#each entry.purchases as purchase}
                    <span class="text-xs bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200 px-2 py-1 rounded">
                      {purchase.item} ({purchase.store})
                    </span>
                  {/each}
                </div>
              </div>
            {/if}

            <!-- Notes -->
            {#if entry.notes}
              <div class="notes-section mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                <div class="text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">📝 Notes</div>
                <div class="text-xs text-gray-600 dark:text-gray-400">{entry.notes}</div>
              </div>
            {/if}
          </div>
        {/each}

        {#if journalEntries.length > 5}
          <div class="text-center">
            <button class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
              View All {journalEntries.length} Entries
            </button>
          </div>
        {/if}
      </div>
    {/if}
  </div>

  <!-- Add Entry Modal -->
  {#if showAddEntry}
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-md w-full mx-4">
        <h3 class="text-lg font-bold text-gray-900 dark:text-white mb-4">Add Journal Entry</h3>
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Record your weather-informed decisions for today.
        </p>
        <div class="flex space-x-3">
          <button
            on:click={addJournalEntry}
            class="flex-1 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
          >
            Add Entry
          </button>
          <button
            on:click={() => showAddEntry = false}
            class="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  {/if}
</div>

<style>
  .badge-card:hover {
    @apply transform scale-105;
  }

  .journal-entry:hover {
    @apply transform scale-105;
  }

  .decision-item {
    @apply p-2 bg-gray-50 dark:bg-gray-800 rounded;
  }
</style> 