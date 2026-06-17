/* Cross-page transitions. Uses the native View Transitions API when
   available; otherwise a lightweight fade. Same-origin internal links
   only; respects modifier-clicks, new tabs, downloads, and hashes. */

export function initTransitions() {
  const supportsVT = typeof document.startViewTransition === 'function';

  function isInternal(a) {
    if (!a || !a.href) return false;
    if (a.target && a.target !== '_self') return false;
    if (a.hasAttribute('download') || a.dataset.noTransition !== undefined) return false;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return false;
    if (url.pathname === location.pathname && url.hash) return false; // in-page anchor
    return /\.html?$/.test(url.pathname) || url.pathname.endsWith('/') || !/\.\w+$/.test(url.pathname);
  }

  document.addEventListener('click', (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const a = e.target.closest('a');
    if (!isInternal(a)) return;
    const dest = a.href;

    if (supportsVT) return; // browser handles the animation natively on navigation

    e.preventDefault();
    document.body.classList.add('page-leaving');
    setTimeout(() => { location.href = dest; }, 240);
  });

  // restore on back/forward (pageshow fires from bfcache)
  window.addEventListener('pageshow', () => document.body.classList.remove('page-leaving'));
}
