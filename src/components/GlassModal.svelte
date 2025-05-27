<script lang="ts">
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  export let open = false;
  const dispatch = createEventDispatcher();

  let modalRef: HTMLDivElement | null = null;
  let lastFocused: HTMLElement | null = null;

  function close() {
    dispatch('close');
  }

  function handleKeydown(e: KeyboardEvent) {
    if (e.key === 'Escape') {
      close();
    }
    // Focus trap
    if (e.key === 'Tab' && modalRef) {
      const focusable = modalRef.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      }
    }
  }

  onMount(() => {
    if (open) {
      lastFocused = document.activeElement as HTMLElement;
      setTimeout(() => modalRef?.focus(), 0);
      window.addEventListener('keydown', handleKeydown);
    }
  });
  onDestroy(() => {
    window.removeEventListener('keydown', handleKeydown);
    if (lastFocused) lastFocused.focus();
  });
  $: if (open && modalRef) {
    setTimeout(() => modalRef?.focus(), 0);
  }
</script>

{#if open}
  <div class="glass-modal-backdrop" tabindex="-1" on:click={() => close()}></div>
  <div
    class="glass-modal"
    tabindex="0"
    bind:this={modalRef}
    role="dialog"
    aria-modal="true"
    on:click|stopPropagation
  >
    <button class="glass-modal-close" aria-label="Close modal" on:click={close}>&times;</button>
    <div class="glass-modal-content">
      <slot />
    </div>
  </div>
{/if}

<style>
  .glass-modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(30, 41, 59, 0.25);
    backdrop-filter: blur(8px);
    z-index: 50;
  }
  .glass-modal {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    min-width: 320px;
    max-width: 90vw;
    min-height: 120px;
    max-height: 90vh;
    background: rgba(255,255,255,0.25);
    border-radius: 1.5rem;
    box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
    backdrop-filter: blur(24px) saturate(180%);
    -webkit-backdrop-filter: blur(24px) saturate(180%);
    border: 1px solid rgba(255,255,255,0.18);
    z-index: 100;
    outline: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    animation: glass-modal-in 0.2s;
  }
  @keyframes glass-modal-in {
    from { opacity: 0; transform: translate(-50%, -60%) scale(0.95); }
    to { opacity: 1; transform: translate(-50%, -50%) scale(1); }
  }
  .glass-modal-content {
    padding: 2rem 1.5rem 1.5rem 1.5rem;
    overflow-y: auto;
    flex: 1;
  }
  .glass-modal-close {
    position: absolute;
    top: 1rem;
    right: 1rem;
    background: rgba(255,255,255,0.4);
    border: none;
    border-radius: 50%;
    width: 2.5rem;
    height: 2.5rem;
    font-size: 2rem;
    color: #334155;
    cursor: pointer;
    transition: background 0.2s;
    z-index: 10;
  }
  .glass-modal-close:hover {
    background: rgba(255,255,255,0.7);
  }
</style> 