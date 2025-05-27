<script lang="ts">
  export let code: number;

  // Map weather codes to icon types
  function getIconType(code: number): string {
    if ([0, 1].includes(code)) return 'clear';
    if ([2, 3].includes(code)) return 'partly-cloudy';
    if ([45, 48].includes(code)) return 'fog';
    if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) return 'rain';
    if ([71, 73, 75, 77, 85, 86].includes(code)) return 'snow';
    if ([95, 96, 99].includes(code)) return 'thunder';
    return 'cloudy';
  }

  $: iconType = getIconType(code);
</script>

{#if iconType === 'clear'}
  <!-- Animated sun -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="32" cy="32" r="14" fill="#FFD93B">
      <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
    </circle>
    <!-- Sun rays -->
    {#each Array(8) as _, i}
      <rect x="31" y="6" width="2" height="10" fill="#FFD93B" transform={`rotate(${i*45} 32 32)`}>
        <animate attributeName="height" values="10;14;10" dur="2s" repeatCount="indefinite" begin={`${i*0.2}s`} />
      </rect>
    {/each}
  </svg>
{:else if iconType === 'partly-cloudy'}
  <!-- Sun + cloud -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <circle cx="24" cy="28" r="10" fill="#FFD93B">
      <animate attributeName="r" values="10;12;10" dur="2s" repeatCount="indefinite" />
    </circle>
    <ellipse cx="40" cy="38" rx="16" ry="10" fill="#B0BEC5">
      <animate attributeName="rx" values="16;18;16" dur="2s" repeatCount="indefinite" />
    </ellipse>
  </svg>
{:else if iconType === 'cloudy'}
  <!-- Animated cloud -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="40" rx="18" ry="12" fill="#B0BEC5">
      <animate attributeName="rx" values="18;20;18" dur="2s" repeatCount="indefinite" />
    </ellipse>
  </svg>
{:else if iconType === 'rain'}
  <!-- Cloud + animated rain -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="38" rx="16" ry="10" fill="#B0BEC5" />
    {#each [20, 32, 44] as x, i}
      <rect x={x} y="48" width="4" height="12" fill="#4FC3F7">
        <animate attributeName="y" values="48;60;48" dur="1.2s" repeatCount="indefinite" begin={`${i*0.3}s`} />
      </rect>
    {/each}
  </svg>
{:else if iconType === 'snow'}
  <!-- Cloud + animated snow -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="38" rx="16" ry="10" fill="#B0BEC5" />
    {#each [24, 32, 40] as x, i}
      <circle cx={x} cy="54" r="2" fill="#fff">
        <animate attributeName="cy" values="54;62;54" dur="1.5s" repeatCount="indefinite" begin={`${i*0.4}s`} />
      </circle>
    {/each}
  </svg>
{:else if iconType === 'thunder'}
  <!-- Cloud + animated lightning -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="38" rx="16" ry="10" fill="#B0BEC5" />
    <polyline points="28,44 36,44 32,54" fill="none" stroke="#FFD93B" stroke-width="3">
      <animate attributeName="points" values="28,44 36,44 32,54;30,46 38,44 34,56;28,44 36,44 32,54" dur="1.2s" repeatCount="indefinite" />
    </polyline>
  </svg>
{:else if iconType === 'fog'}
  <!-- Cloud + animated fog lines -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
    <ellipse cx="32" cy="38" rx="16" ry="10" fill="#B0BEC5" />
    {#each [44, 50] as y, i}
      <rect x="18" y={y} width="28" height="3" fill="#B0BEC5" opacity="0.7">
        <animate attributeName="x" values="18;22;18" dur="2s" repeatCount="indefinite" begin={`${i*0.5}s`} />
      </rect>
    {/each}
  </svg>
{/if} 