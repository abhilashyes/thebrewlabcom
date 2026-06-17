/* Pitch deck controller — keyboard (←/→/space/Home/End), swipe,
   on-screen prev/next, clickable dots, progress + counter, deep-link
   via #hash, and print-to-PDF (CSS handles the print layout).
   Slide changes are announced to assistive tech. */

export function initDeck() {
  const deck = document.querySelector('[data-deck]');
  const track = document.querySelector('[data-deck-track]');
  if (!deck || !track) return;
  const slides = Array.from(track.querySelectorAll('.slide'));
  const prevBtn = document.querySelector('[data-deck-prev]');
  const nextBtn = document.querySelector('[data-deck-next]');
  const counter = document.querySelector('[data-deck-counter]');
  const bar = document.querySelector('[data-deck-bar]');
  const dotsWrap = document.querySelector('[data-deck-dots]');
  const live = document.querySelector('[data-deck-live]');
  const total = slides.length;
  let i = 0;

  document.body.classList.add('deck-body');

  // build dots
  const dots = slides.map((s, idx) => {
    const b = document.createElement('button');
    b.className = 'deck-dot';
    b.type = 'button';
    b.setAttribute('aria-label', `Go to slide ${idx + 1}: ${s.dataset.title || ''}`.trim());
    b.addEventListener('click', () => goto(idx));
    dotsWrap && dotsWrap.appendChild(b);
    return b;
  });

  slides.forEach((s, idx) => {
    s.setAttribute('role', 'group');
    s.setAttribute('aria-roledescription', 'slide');
    s.setAttribute('aria-label', `${idx + 1} of ${total}`);
  });

  function render() {
    track.style.transform = `translateX(${-i * 100}%)`;
    if (counter) counter.textContent = `${String(i + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}`;
    if (bar) bar.style.width = `${((i + 1) / total) * 100}%`;
    dots.forEach((d, idx) => d.setAttribute('aria-current', String(idx === i)));
    if (prevBtn) prevBtn.disabled = i === 0;
    if (nextBtn) nextBtn.disabled = i === total - 1;
    slides.forEach((s, idx) => s.toggleAttribute('inert', idx !== i));
    if (live) live.textContent = `Slide ${i + 1} of ${total}: ${slides[i].dataset.title || ''}`;
    if (history.replaceState) history.replaceState(null, '', `#${i + 1}`);
  }

  function goto(n) { i = Math.max(0, Math.min(total - 1, n)); render(); }
  const next = () => goto(i + 1);
  const prev = () => goto(i - 1);

  nextBtn && nextBtn.addEventListener('click', next);
  prevBtn && prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) { e.preventDefault(); next(); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp' || (e.key === ' ' && e.shiftKey)) { e.preventDefault(); prev(); }
    else if (e.key === 'Home') { e.preventDefault(); goto(0); }
    else if (e.key === 'End') { e.preventDefault(); goto(total - 1); }
  });

  // swipe (touch)
  let x0 = null;
  deck.addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
  deck.addEventListener('touchend', (e) => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    if (Math.abs(dx) > 45) (dx < 0 ? next : prev)();
    x0 = null;
  }, { passive: true });

  // deep link
  const start = parseInt(location.hash.replace('#', ''), 10);
  if (!Number.isNaN(start)) i = Math.max(0, Math.min(total - 1, start - 1));

  render();
}
