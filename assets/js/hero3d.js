/* WebGL hero — a drifting field of "beans" and rising "steam" in
   brand colors, gently parallaxing to the pointer / device tilt.
   Performance-first: capped DPR, reduced counts on mobile, paused
   when offscreen or backgrounded. If WebGL or the CDN is missing,
   main.js simply never gets here and the CSS editor hero stands in. */

import * as THREE from 'three';

export function initHero3D({ isSmall } = {}) {
  const mount = document.querySelector('[data-hero-canvas]');
  if (!mount) return;

  // bail cleanly if WebGL is unavailable
  try {
    const test = document.createElement('canvas');
    if (!(test.getContext('webgl2') || test.getContext('webgl'))) return;
  } catch (_) { return; }

  const cssVar = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  const palette = () => [cssVar('--lavender'), cssVar('--cyan'), cssVar('--champagne'), cssVar('--rose')]
    .map((c) => new THREE.Color(c || '#A78BFA'));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
  camera.position.z = 18;

  const renderer = new THREE.WebGLRenderer({ antialias: !isSmall, alpha: true, powerPreference: 'low-power' });
  renderer.setClearColor(0x000000, 0);
  mount.appendChild(renderer.domElement);

  const COUNT = isSmall ? 90 : 220;
  const colors = palette();
  const geo = new THREE.BufferGeometry();
  const pos = new Float32Array(COUNT * 3);
  const col = new Float32Array(COUNT * 3);
  const speed = new Float32Array(COUNT);
  const size = new Float32Array(COUNT);

  for (let i = 0; i < COUNT; i++) {
    pos[i * 3] = (Math.random() - 0.5) * 34;
    pos[i * 3 + 1] = (Math.random() - 0.5) * 26;
    pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
    const c = colors[(Math.random() * colors.length) | 0];
    col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    speed[i] = 0.4 + Math.random() * 1.1;
    size[i] = 6 + Math.random() * 16;
  }
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('color', new THREE.BufferAttribute(col, 3));

  // soft round sprite
  const tex = (() => {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const g = c.getContext('2d');
    const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
    grd.addColorStop(0, 'rgba(255,255,255,1)');
    grd.addColorStop(0.4, 'rgba(255,255,255,0.55)');
    grd.addColorStop(1, 'rgba(255,255,255,0)');
    g.fillStyle = grd; g.fillRect(0, 0, 64, 64);
    const t = new THREE.CanvasTexture(c); t.needsUpdate = true; return t;
  })();

  const mat = new THREE.PointsMaterial({
    size: 0.9, map: tex, vertexColors: true, transparent: true,
    depthWrite: false, blending: THREE.AdditiveBlending, opacity: 0.9,
  });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // pointer / tilt parallax
  let px = 0, py = 0, tx = 0, ty = 0;
  const onMove = (e) => {
    const t = e.touches ? e.touches[0] : e;
    px = (t.clientX / innerWidth - 0.5) * 2;
    py = (t.clientY / innerHeight - 0.5) * 2;
  };
  addEventListener('mousemove', onMove, { passive: true });
  addEventListener('deviceorientation', (e) => {
    if (e.gamma == null) return;
    px = Math.max(-1, Math.min(1, e.gamma / 35));
    py = Math.max(-1, Math.min(1, (e.beta - 45) / 35));
  }, { passive: true });

  function resize() {
    const r = mount.getBoundingClientRect();
    const w = Math.max(1, r.width), h = Math.max(1, r.height || 360);
    renderer.setPixelRatio(Math.min(devicePixelRatio, isSmall ? 1.5 : 2));
    renderer.setSize(w, h, false);
    camera.aspect = w / h; camera.updateProjectionMatrix();
  }
  resize();
  addEventListener('resize', resize, { passive: true });
  window.addEventListener('themechange', () => {
    const p = palette();
    for (let i = 0; i < COUNT; i++) {
      const c = p[(Math.random() * p.length) | 0];
      col[i * 3] = c.r; col[i * 3 + 1] = c.g; col[i * 3 + 2] = c.b;
    }
    geo.attributes.color.needsUpdate = true;
  });

  let running = true, raf = 0;
  const clock = new THREE.Clock();

  function frame() {
    if (!running) return;
    const dt = Math.min(clock.getDelta(), 0.05);
    const arr = geo.attributes.position.array;
    for (let i = 0; i < COUNT; i++) {
      arr[i * 3 + 1] += speed[i] * dt; // drift up like steam
      if (arr[i * 3 + 1] > 14) arr[i * 3 + 1] = -14;
    }
    geo.attributes.position.needsUpdate = true;

    tx += (px - tx) * 0.04; ty += (py - ty) * 0.04;
    points.rotation.y += 0.02 * dt + tx * 0.01;
    points.rotation.x = ty * 0.18;
    camera.position.x = tx * 2.2;
    camera.position.y = -ty * 1.6;
    camera.lookAt(0, 0, 0);

    renderer.render(scene, camera);
    raf = requestAnimationFrame(frame);
  }

  function start() { if (!running) { running = true; clock.start(); frame(); } }
  function stop() { running = false; cancelAnimationFrame(raf); }

  document.addEventListener('visibilitychange', () => document.hidden ? stop() : start());
  if ('IntersectionObserver' in window) {
    new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting ? start() : stop()), { threshold: 0.01 })
      .observe(mount);
  }

  requestAnimationFrame(() => { mount.classList.add('ready'); frame(); });
}
