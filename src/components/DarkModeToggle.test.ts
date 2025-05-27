import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent } from '@testing-library/svelte';
import DarkModeToggle from './DarkModeToggle.svelte';

describe('DarkModeToggle', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
    });
  });

  it('renders the toggle button', () => {
    const { getByLabelText } = render(DarkModeToggle);
    expect(getByLabelText('Toggle dark mode')).toBeTruthy();
  });

  it('toggles dark mode on click', async () => {
    const { getByLabelText } = render(DarkModeToggle);
    const btn = getByLabelText('Toggle dark mode');
    await fireEvent.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    await fireEvent.click(btn);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
  });

  it('updates title based on mode', async () => {
    const { getByLabelText } = render(DarkModeToggle);
    const btn = getByLabelText('Toggle dark mode');
    expect(btn.title).toMatch(/Switch to dark mode|Switch to light mode/);
  });
}); 