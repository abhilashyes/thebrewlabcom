/* ============================================================
   The Brew Lab — per-page bootstrap
   Core (theme, nav, reveal) runs everywhere. Heavy/optional
   modules are lazy, dynamically imported, and wrapped so a CDN
   or WebGL failure degrades gracefully instead of breaking the page.
   ============================================================ */

import { initTheme } from './theme.js';

const root = document.documentElement;
root.classList.add('js');

/* Themed placeholder photos are hotlinked from a public source. If one
   fails to load (source down, offline, blocked), degrade the frame to an
   on-brand fallback instead of showing a broken-image icon. Capture phase
   because <img> error events don't bubble. */
document.addEventListener('error', (e) => {
  const img = e.target;
  if (img && img.tagName === 'IMG') {
    const frame = img.closest('.frame');
    if (frame) { frame.classList.add('img-failed'); img.remove(); }
  }
}, true);

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const isSmall = window.matchMedia('(max-width: 820px)').matches;

/* lazy import that never throws — logs and moves on */
async function load(path, init) {
  try {
    const mod = await import(path);
    return init ? init(mod) : mod;
  } catch (err) {
    console.warn(`[brewlab] optional module failed: ${path}`, err);
    return null;
  }
}

/* ---------- core: mobile nav ---------- */
function initNav() {
  const burger = document.querySelector('[data-nav-burger]');
  const menu = document.querySelector('[data-nav-menu]');
  const close = document.querySelector('[data-nav-close]');
  if (!burger || !menu) return;

  const setOpen = (open) => {
    menu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
    document.body.style.overflow = open ? 'hidden' : '';
    if (open) {
      const first = menu.querySelector('a, button');
      first && first.focus();
    } else {
      burger.focus();
    }
  };

  burger.addEventListener('click', () => setOpen(!menu.classList.contains('open')));
  close && close.addEventListener('click', () => setOpen(false));
  menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('open')) setOpen(false);
  });
}

/* ---------- core: scroll reveal (no dependency) ---------- */
function initReveal() {
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  if (reduceMotion || !('IntersectionObserver' in window)) {
    els.forEach((el) => el.classList.add('in'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
  els.forEach((el) => io.observe(el));
}

/* ---------- boot ---------- */
function boot() {
  initTheme();
  initNav();
  initReveal();

  const page = document.body.dataset.page;
  const ctx = { reduceMotion, finePointer, isSmall };

  /* page transitions — everywhere, cheap */
  load('./transitions.js', (m) => m.initTransitions(ctx));

  /* custom cursor — desktop, motion-on only */
  if (finePointer && !reduceMotion) {
    load('./cursor.js', (m) => m.initCursor(ctx));
  }

  /* smooth scroll — skip on reduced motion and on the (non-scrolling) deck */
  let lenisPromise = null;
  if (!reduceMotion && page !== 'deck') {
    lenisPromise = load('./smoothScroll.js', (m) => m.initSmoothScroll(ctx));
  }

  /* per-page enhancements */
  if (page === 'home') {
    load('./repl.js', (m) => m.initRepl(ctx));
    if (!reduceMotion) {
      load('./hero3d.js', (m) => m.initHero3D(ctx));
      load('./cinematics.js', (m) => m.initCinematics({ ...ctx, lenisPromise }));
    }
  } else if (page === 'story') {
    if (!reduceMotion) load('./cinematics.js', (m) => m.initCinematics({ ...ctx, lenisPromise }));
  } else if (page === 'rewards') {
    if (!reduceMotion) load('./cinematics.js', (m) => m.initCinematics({ ...ctx, lenisPromise }));
  } else if (page === 'deck') {
    load('./deck.js', (m) => m.initDeck(ctx));
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot, { once: true });
} else {
  boot();
}
