/* Lenis smooth scrolling. Returns the instance so cinematics can
   drive ScrollTrigger from the same rAF loop. Fails soft if the CDN
   module can't load (native scroll continues to work). */

import Lenis from 'lenis';

let instance = null;

export function getLenis() { return instance; }

export function initSmoothScroll() {
  if (instance) return instance;
  instance = new Lenis({
    duration: 1.05,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    syncTouch: false, // let native momentum handle touch — better on mobile
  });

  let rafId;
  function raf(time) {
    instance.raf(time);
    rafId = requestAnimationFrame(raf);
  }
  rafId = requestAnimationFrame(raf);

  // anchor links route through Lenis
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id.length < 2) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      instance.scrollTo(target, { offset: -70 });
    });
  });

  instance.__stop = () => cancelAnimationFrame(rafId);
  return instance;
}
