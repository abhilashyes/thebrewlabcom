/* Scroll cinematics with GSAP + ScrollTrigger, driven by native scroll.
   Pinned brew-journey, parallax layers, and count-up stats.
   main.js never calls this under reduced-motion. Fails soft. */

import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

export async function initCinematics() {
  gsap.registerPlugin(ScrollTrigger);

  // ---- parallax layers ----
  gsap.utils.toArray('[data-parallax]').forEach((el) => {
    const depth = parseFloat(el.dataset.parallax) || 0.2;
    gsap.to(el, {
      yPercent: -depth * 100,
      ease: 'none',
      scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
    });
  });

  // ---- count-up stats ----
  gsap.utils.toArray('[data-count]').forEach((el) => {
    const end = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const group = el.dataset.group !== undefined; // opt-in thousands separators
    const fmt = (n) => group ? n.toLocaleString() : String(n);
    const obj = { v: 0 };
    ScrollTrigger.create({
      trigger: el, start: 'top 85%', once: true,
      onEnter: () => gsap.to(obj, {
        v: end, duration: 1.4, ease: 'power2.out',
        onUpdate: () => { el.textContent = prefix + fmt(Math.round(obj.v)) + suffix; },
      }),
    });
  });

  // ---- staggered group reveals ----
  gsap.utils.toArray('[data-cine-group]').forEach((group) => {
    const items = group.querySelectorAll('[data-cine-item]');
    if (!items.length) return;
    gsap.from(items, {
      y: 40, opacity: 0, duration: 0.8, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: group, start: 'top 78%' },
    });
  });

  // ---- pinned brew journey ----
  const journey = document.querySelector('[data-brew-journey]');
  if (journey) {
    const fill = journey.querySelector('.fill');
    const stages = journey.querySelectorAll('[data-stage]');
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: journey, start: 'top top', end: '+=' + (stages.length * 60) + '%',
        scrub: 0.6, pin: true, anticipatePin: 1,
      },
    });
    stages.forEach((stage, i) => {
      tl.fromTo(stage, { opacity: 0.25, y: 24 }, { opacity: 1, y: 0, duration: 1 }, i)
        .to(stage, { opacity: 0.25, y: -24, duration: 1 }, i + 0.9);
    });
    if (fill) {
      gsap.to(fill, {
        width: '100%', ease: 'none',
        scrollTrigger: { trigger: journey, start: 'top top', end: '+=' + (stages.length * 60) + '%', scrub: 0.6 },
      });
    }
  }

  requestAnimationFrame(() => ScrollTrigger.refresh());
}
