/* Pitch scrollytelling — vanilla, no dependencies (so it works even if
   the CDN/GSAP never load). Tracks which chapter is centered in the
   viewport and updates the sticky stage (number, keyword, nav) plus a
   top scroll-progress bar. Stage dots scroll to their chapter. */

export function initPitchStory() {
  const chapters = Array.from(document.querySelectorAll('[data-chapter]'));
  if (!chapters.length) return;

  const numEl = document.querySelector('[data-stage-num]');
  const wordEl = document.querySelector('[data-stage-word]');
  const navWrap = document.querySelector('[data-stage-nav]');
  const progress = document.querySelector('[data-ps-progress]');

  // build the chapter nav (desktop)
  let dots = [];
  if (navWrap) {
    chapters.forEach((ch) => {
      const li = document.createElement('li');
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'ps-dot';
      b.innerHTML = `<span class="n mono">${ch.dataset.stageNum || ''}</span><span class="w">${ch.dataset.stageWord || ''}</span>`;
      b.addEventListener('click', () => ch.scrollIntoView({ behavior: 'smooth', block: 'start' }));
      li.appendChild(b);
      navWrap.appendChild(li);
      dots.push(b);
    });
  }

  let active = -1;
  function setActive(idx) {
    if (idx === active || !chapters[idx]) return;
    active = idx;
    const ch = chapters[idx];
    if (numEl) numEl.textContent = ch.dataset.stageNum || '';
    if (wordEl) wordEl.textContent = ch.dataset.stageWord || '';
    dots.forEach((d, i) => d.setAttribute('aria-current', String(i === idx)));
  }

  // a chapter becomes active when it crosses the middle band of the viewport
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) setActive(chapters.indexOf(e.target));
      });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    chapters.forEach((c) => io.observe(c));
  }
  setActive(0);

  // top scroll-progress bar
  if (progress) {
    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      progress.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
      ticking = false;
    };
    addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    addEventListener('resize', update);
    update();
  }
}
