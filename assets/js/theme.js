/* Theme toggle — persisted, system-aware. The pre-paint inline
   snippet in <head> sets the initial theme to avoid a flash; this
   module wires up the toggle buttons and keeps them in sync. */

const KEY = 'brewlab-theme';

export function getTheme() {
  return document.documentElement.getAttribute('data-theme') || 'dark';
}

function apply(theme) {
  document.documentElement.setAttribute('data-theme', theme);
  try { localStorage.setItem(KEY, theme); } catch (_) {}
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    const next = theme === 'dark' ? 'light' : 'dark';
    const icon = btn.querySelector('[data-theme-icon]');
    const txt = btn.querySelector('[data-theme-text]');
    if (icon) icon.textContent = theme === 'dark' ? '◑' : '◐';
    if (txt) txt.textContent = next;
    btn.setAttribute('aria-label', `Switch to ${next} theme`);
  });
}

export function initTheme() {
  apply(getTheme());
  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    btn.addEventListener('click', () => {
      apply(getTheme() === 'dark' ? 'light' : 'dark');
      window.dispatchEvent(new CustomEvent('themechange', { detail: { theme: getTheme() } }));
    });
  });
}
