<script lang="ts">
  export let code: number;
  export let isNight: boolean = false;

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
  {#if isNight}
    <!-- Animated moon with glow and stars for night -->
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Clear night">
      <defs>
        <radialGradient id="moonGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffde4" />
          <stop offset="80%" stop-color="#bfc6e0" />
          <stop offset="100%" stop-color="#8a99b8" />
        </radialGradient>
        <filter id="moonGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <!-- Moon core -->
      <circle cx="36" cy="32" r="14" fill="url(#moonGradient)" filter="url(#moonGlow)">
        <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
      </circle>
      <!-- Crescent shadow -->
      <ellipse cx="40" cy="32" rx="10" ry="13" fill="#232946" opacity="0.5" />
      <!-- Stars -->
      <circle cx="18" cy="18" r="1.2" fill="#fff" opacity="0.8">
        <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2.5s" repeatCount="indefinite" />
      </circle>
      <circle cx="50" cy="14" r="0.8" fill="#fff" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.1;0.7" dur="2.2s" repeatCount="indefinite" />
      </circle>
      <circle cx="24" cy="48" r="0.9" fill="#fff" opacity="0.6">
        <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.8s" repeatCount="indefinite" />
      </circle>
    </svg>
  {:else}
    <!-- Animated sun with gradient, glow, and parallax rays -->
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Sunny">
      <defs>
        <radialGradient id="sunGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFF9C4" />
          <stop offset="70%" stop-color="#FFD93B" />
          <stop offset="100%" stop-color="#FFC107" />
        </radialGradient>
        <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <!-- Sun core -->
      <circle cx="32" cy="32" r="14" fill="url(#sunGradient)" filter="url(#sunGlow)">
        <animate attributeName="r" values="14;16;14" dur="2s" repeatCount="indefinite" />
      </circle>
      <!-- Sun rays with parallax -->
      {#each Array(8) as _, i}
        <rect x="31" y="6" width="2" height="12" rx="1" fill="#FFD93B" opacity="0.85"
          transform={`rotate(${i*45} 32 32)`}>
          <animate attributeName="height" values="12;18;12" dur="2s" repeatCount="indefinite" begin={`${i*0.18}s`} />
          <animate attributeName="opacity" values="0.85;1;0.85" dur="2s" repeatCount="indefinite" begin={`${i*0.18}s`} />
        </rect>
      {/each}
      <!-- Subtle outer glow -->
      <circle cx="32" cy="32" r="22" fill="#FFF9C4" opacity="0.18">
        <animate attributeName="r" values="22;24;22" dur="2s" repeatCount="indefinite" />
      </circle>
    </svg>
  {/if}
{:else if iconType === 'partly-cloudy'}
  {#if isNight}
    <!-- Moon + clouds for partly cloudy night -->
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Partly cloudy night">
      <defs>
        <radialGradient id="pcMoonGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#fffde4" />
          <stop offset="80%" stop-color="#bfc6e0" />
          <stop offset="100%" stop-color="#8a99b8" />
        </radialGradient>
        <linearGradient id="pcNightCloudGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#bfc6e0" />
          <stop offset="100%" stop-color="#6b7280" />
        </linearGradient>
      </defs>
      <!-- Moon core -->
      <circle cx="22" cy="26" r="8" fill="url(#pcMoonGradient)">
        <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
      </circle>
      <!-- Crescent shadow -->
      <ellipse cx="25" cy="26" rx="5" ry="8" fill="#232946" opacity="0.4" />
      <!-- Back cloud -->
      <ellipse cx="40" cy="38" rx="16" ry="10" fill="url(#pcNightCloudGradient)" opacity="0.7">
        <animate attributeName="rx" values="16;18;16" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <!-- Front cloud -->
      <ellipse cx="32" cy="44" rx="10" ry="6" fill="url(#pcNightCloudGradient)" opacity="0.9">
        <animate attributeName="rx" values="10;12;10" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <!-- Stars -->
      <circle cx="50" cy="18" r="1.1" fill="#fff" opacity="0.7">
        <animate attributeName="opacity" values="0.7;0.2;0.7" dur="2.5s" repeatCount="indefinite" />
      </circle>
    </svg>
  {:else}
    <!-- Sun + layered clouds, animated rays, gradients -->
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Partly cloudy">
      <defs>
        <radialGradient id="pcSunGradient" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#FFF9C4" />
          <stop offset="70%" stop-color="#FFD93B" />
          <stop offset="100%" stop-color="#FFC107" />
        </radialGradient>
        <linearGradient id="pcCloudGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#ECEFF1" />
          <stop offset="100%" stop-color="#B0BEC5" />
        </linearGradient>
      </defs>
      <!-- Sun core -->
      <circle cx="22" cy="26" r="8" fill="url(#pcSunGradient)">
        <animate attributeName="r" values="8;10;8" dur="2s" repeatCount="indefinite" />
      </circle>
      <!-- Sun rays -->
      {#each Array(6) as _, i}
        <rect x="21" y="10" width="2" height="7" rx="1" fill="#FFD93B" opacity="0.7"
          transform={`rotate(${i*60} 22 26)`}>
          <animate attributeName="height" values="7;11;7" dur="2s" repeatCount="indefinite" begin={`${i*0.15}s`} />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" begin={`${i*0.15}s`} />
        </rect>
      {/each}
      <!-- Back cloud -->
      <ellipse cx="40" cy="38" rx="16" ry="10" fill="url(#pcCloudGradient)" opacity="0.7">
        <animate attributeName="rx" values="16;18;16" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
      <!-- Front cloud -->
      <ellipse cx="32" cy="44" rx="10" ry="6" fill="url(#pcCloudGradient)" opacity="0.9">
        <animate attributeName="rx" values="10;12;10" dur="2.5s" repeatCount="indefinite" />
      </ellipse>
    </svg>
  {/if}
{:else if iconType === 'cloudy'}
  <!-- Multiple animated clouds, gradients, parallax -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Cloudy">
    <defs>
      <linearGradient id="cloudGrad1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ECEFF1" />
        <stop offset="100%" stop-color="#B0BEC5" />
      </linearGradient>
      <linearGradient id="cloudGrad2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#CFD8DC" />
        <stop offset="100%" stop-color="#90A4AE" />
      </linearGradient>
    </defs>
    <!-- Back cloud -->
    <ellipse cx="38" cy="38" rx="16" ry="10" fill="url(#cloudGrad1)" opacity="0.7">
      <animate attributeName="cx" values="38;42;38" dur="3s" repeatCount="indefinite" />
    </ellipse>
    <!-- Middle cloud -->
    <ellipse cx="28" cy="44" rx="12" ry="8" fill="url(#cloudGrad2)" opacity="0.85">
      <animate attributeName="cx" values="28;24;28" dur="3s" repeatCount="indefinite" />
    </ellipse>
    <!-- Front cloud -->
    <ellipse cx="32" cy="48" rx="10" ry="6" fill="url(#cloudGrad1)" opacity="1">
      <animate attributeName="rx" values="10;12;10" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
  </svg>
{:else if iconType === 'rain'}
  <!-- Layered clouds + animated rain drops, gradients -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Rainy">
    <defs>
      <linearGradient id="rainCloudGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B3C6D6" />
        <stop offset="100%" stop-color="#78909C" />
      </linearGradient>
      <linearGradient id="rainDropGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4FC3F7" />
        <stop offset="100%" stop-color="#0288D1" />
      </linearGradient>
    </defs>
    <!-- Back cloud -->
    <ellipse cx="36" cy="38" rx="16" ry="10" fill="url(#rainCloudGrad)" opacity="0.7">
      <animate attributeName="cx" values="36;40;36" dur="3s" repeatCount="indefinite" />
    </ellipse>
    <!-- Front cloud -->
    <ellipse cx="28" cy="44" rx="12" ry="8" fill="url(#rainCloudGrad)" opacity="0.9">
      <animate attributeName="rx" values="12;14;12" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
    <!-- Rain drops -->
    {#each [22, 32, 42] as x, i}
      <rect x={x} y="52" width="3" height="10" rx="1.5" fill="url(#rainDropGrad)" opacity="0.85">
        <animate attributeName="y" values="52;62;52" dur="1.2s" repeatCount="indefinite" begin={`${i*0.3}s`} />
        <animate attributeName="opacity" values="0.85;0.3;0.85" dur="1.2s" repeatCount="indefinite" begin={`${i*0.3}s`} />
      </rect>
    {/each}
  </svg>
{:else if iconType === 'snow'}
  <!-- Layered clouds + animated snowflakes, gradients -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Snowy">
    <defs>
      <linearGradient id="snowCloudGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ECEFF1" />
        <stop offset="100%" stop-color="#B0BEC5" />
      </linearGradient>
      <radialGradient id="snowFlakeGrad" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#fff" />
        <stop offset="100%" stop-color="#B3E5FC" />
      </radialGradient>
    </defs>
    <!-- Back cloud -->
    <ellipse cx="36" cy="38" rx="16" ry="10" fill="url(#snowCloudGrad)" opacity="0.7">
      <animate attributeName="cx" values="36;40;36" dur="3s" repeatCount="indefinite" />
    </ellipse>
    <!-- Front cloud -->
    <ellipse cx="28" cy="44" rx="12" ry="8" fill="url(#snowCloudGrad)" opacity="0.9">
      <animate attributeName="rx" values="12;14;12" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
    <!-- Snowflakes -->
    {#each [24, 32, 40] as x, i}
      <circle cx={x} cy="54" r="2.5" fill="url(#snowFlakeGrad)" opacity="0.95">
        <animate attributeName="cy" values="54;62;54" dur="1.5s" repeatCount="indefinite" begin={`${i*0.4}s`} />
        <animate attributeName="opacity" values="0.95;0.5;0.95" dur="1.5s" repeatCount="indefinite" begin={`${i*0.4}s`} />
      </circle>
    {/each}
  </svg>
{:else if iconType === 'thunder'}
  <!-- Layered clouds + animated lightning, gradients -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Thunderstorm">
    <defs>
      <linearGradient id="thunderCloudGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#B0BEC5" />
        <stop offset="100%" stop-color="#78909C" />
      </linearGradient>
      <linearGradient id="thunderBoltGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#FFF176" />
        <stop offset="100%" stop-color="#FFD600" />
      </linearGradient>
    </defs>
    <!-- Back cloud -->
    <ellipse cx="36" cy="38" rx="16" ry="10" fill="url(#thunderCloudGrad)" opacity="0.7">
      <animate attributeName="cx" values="36;40;36" dur="3s" repeatCount="indefinite" />
    </ellipse>
    <!-- Front cloud -->
    <ellipse cx="28" cy="44" rx="12" ry="8" fill="url(#thunderCloudGrad)" opacity="0.9">
      <animate attributeName="rx" values="12;14;12" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
    <!-- Lightning bolt -->
    <polyline points="30,46 36,46 32,56" fill="none" stroke="url(#thunderBoltGrad)" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <animate attributeName="points" values="30,46 36,46 32,56;32,48 38,46 34,58;30,46 36,46 32,56" dur="1.2s" repeatCount="indefinite" />
      <animate attributeName="stroke-opacity" values="1;0.2;1" dur="1.2s" repeatCount="indefinite" />
    </polyline>
  </svg>
{:else if iconType === 'fog'}
  <!-- Layered clouds + animated fog lines, gradients -->
  <svg width="64" height="64" viewBox="0 0 64 64" fill="none" aria-label="Foggy">
    <defs>
      <linearGradient id="fogCloudGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#ECEFF1" />
        <stop offset="100%" stop-color="#B0BEC5" />
      </linearGradient>
      <linearGradient id="fogLineGrad" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stop-color="#B0BEC5" stop-opacity="0.7" />
        <stop offset="100%" stop-color="#CFD8DC" stop-opacity="0.4" />
      </linearGradient>
    </defs>
    <!-- Cloud -->
    <ellipse cx="32" cy="38" rx="16" ry="10" fill="url(#fogCloudGrad)" opacity="0.8">
      <animate attributeName="rx" values="16;18;16" dur="2.5s" repeatCount="indefinite" />
    </ellipse>
    <!-- Fog lines -->
    {#each [44, 50, 56] as y, i}
      <rect x="16" y={y} width="32" height="3" fill="url(#fogLineGrad)" opacity="0.7">
        <animate attributeName="x" values="16;20;16" dur="2.5s" repeatCount="indefinite" begin={`${i*0.4}s`} />
        <animate attributeName="opacity" values="0.7;0.4;0.7" dur="2.5s" repeatCount="indefinite" begin={`${i*0.4}s`} />
      </rect>
    {/each}
  </svg>
{/if} 