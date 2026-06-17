/* Custom cursor + magnetic buttons. Desktop / fine-pointer only —
   main.js never loads this on touch or reduced-motion. */

export function initCursor() {
  const dot = document.createElement('div');
  const ring = document.createElement('div');
  dot.className = 'cursor-dot';
  ring.className = 'cursor-ring';
  dot.setAttribute('aria-hidden', 'true');
  ring.setAttribute('aria-hidden', 'true');
  document.body.append(dot, ring);
  document.body.classList.add('has-cursor');

  let mx = innerWidth / 2, my = innerHeight / 2;
  let rx = mx, ry = my;

  addEventListener('mousemove', (e) => {
    mx = e.clientX; my = e.clientY;
    dot.style.transform = `translate3d(${mx}px, ${my}px, 0) translate(-50%, -50%)`;
  }, { passive: true });

  (function loop() {
    rx += (mx - rx) * 0.18;
    ry += (my - ry) * 0.18;
    ring.style.transform = `translate3d(${rx}px, ${ry}px, 0) translate(-50%, -50%)`;
    requestAnimationFrame(loop);
  })();

  const hot = 'a, button, .magnetic, input, [role="button"], summary';
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest(hot)) ring.classList.add('hot');
  });
  document.addEventListener('mouseout', (e) => {
    if (e.target.closest(hot)) ring.classList.remove('hot');
  });

  // magnetic pull on opted-in elements
  document.querySelectorAll('.magnetic').forEach((el) => {
    const strength = parseFloat(el.dataset.magnetic || '0.3');
    el.addEventListener('mousemove', (e) => {
      const r = el.getBoundingClientRect();
      const x = e.clientX - (r.left + r.width / 2);
      const y = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${x * strength}px, ${y * strength}px)`;
    });
    el.addEventListener('mouseleave', () => { el.style.transform = ''; });
  });

  addEventListener('mouseleave', () => { dot.style.opacity = ring.style.opacity = '0'; });
  addEventListener('mouseenter', () => { dot.style.opacity = ring.style.opacity = '1'; });
}
