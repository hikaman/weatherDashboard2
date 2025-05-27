import { describe, it, expect } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import GlassModal from './GlassModal.svelte';
import type { SvelteComponentTyped } from 'svelte';

function getOpenModal() {
  return render(GlassModal, { props: { open: true } });
}

describe('GlassModal', () => {
  it('renders modal when open', () => {
    const { getByRole } = getOpenModal();
    expect(getByRole('dialog')).toBeTruthy();
  });

  it('closes on ESC key', async () => {
    const { component, getByRole } = getOpenModal();
    const dialog = getByRole('dialog');
    let closed = false;
    (component as SvelteComponentTyped).$on('close', () => { closed = true; });
    await fireEvent.keyDown(dialog, { key: 'Escape' });
    expect(closed).toBe(true);
  });

  it('closes on backdrop click', async () => {
    const { component, container } = getOpenModal();
    let closed = false;
    (component as SvelteComponentTyped).$on('close', () => { closed = true; });
    const backdrop = container.querySelector('.glass-modal-backdrop') as HTMLElement;
    if (backdrop) {
      await fireEvent.click(backdrop);
    }
    expect(closed).toBe(true);
  });

  it('traps focus inside modal', async () => {
    const { getByRole } = getOpenModal();
    const dialog = getByRole('dialog');
    dialog.focus();
    expect(document.activeElement).toBe(dialog);
  });
}); 