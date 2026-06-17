/* Interactive REPL — the hero's code editor becomes a working
   terminal. Fully keyboard-driven, but every command is also a
   tappable chip so it works with no physical keyboard (mobile).
   Output is an ARIA live region so screen readers hear responses. */

export function initRepl() {
  const repl = document.querySelector('[data-repl]');
  if (!repl) return;
  const stream = repl.querySelector('[data-repl-stream]');
  const input = repl.querySelector('[data-repl-input]');
  const form = repl.querySelector('[data-repl-form]');
  if (!stream || !input || !form) return;

  const history = [];
  let hpos = -1;

  const esc = (s) => s.replace(/[&<>]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));

  function print(html, cls = '') {
    const div = document.createElement('div');
    div.className = `repl-line ${cls}`.trim();
    div.innerHTML = html;
    stream.appendChild(div);
    stream.scrollTop = stream.scrollHeight;
  }
  const echo = (cmd) => print(esc(cmd), 'you');

  const commands = {
    help() {
      print('available commands:', 'accent');
      print('  <span class="ok">menu</span>      — see what we pour');
      print('  <span class="ok">brew</span> &lt;drink&gt; — pull a sample shot');
      print('  <span class="ok">rewards</span>   — the 5-tier loyalty ladder');
      print('  <span class="ok">locate</span>    — find a Brew Lab near you');
      print('  <span class="ok">story</span>     — why we exist');
      print('  <span class="ok">partner</span>   — open a Brew Lab with us');
      print('  <span class="ok">theme</span>     — flip dark / light');
      print('  <span class="ok">clear</span>     — wipe the screen');
    },
    menu() {
      print('routing → <span class="ok">menu.html</span> …', 'accent');
      go('menu.html');
    },
    rewards() { print('routing → <span class="ok">rewards.html</span> …', 'accent'); go('rewards.html'); },
    locate() { print('routing → <span class="ok">story.html#locations</span> …', 'accent'); go('story.html#locations'); },
    story() { print('routing → <span class="ok">story.html</span> …', 'accent'); go('story.html'); },
    partner() { print('routing → <span class="ok">franchise.html</span> …', 'accent'); go('franchise.html'); },
    pitch() { print('routing → <span class="ok">pitch.html</span> …', 'accent'); go('pitch.html'); },
    theme() {
      const btn = document.querySelector('[data-theme-toggle]');
      btn && btn.click();
      print('theme → <span class="ok">' + (document.documentElement.getAttribute('data-theme')) + '</span>');
    },
    clear() { stream.innerHTML = ''; },
    brew(arg) {
      const drink = (arg || 'house').toLowerCase();
      print(`brewing <span class="warn">${esc(drink)}</span> …`, 'accent');
      const steps = ['grinding beans', 'dialing in', `pulling ${esc(drink)}`, 'served ✓'];
      steps.forEach((s, i) => setTimeout(() => print(`› <span class="ok">${s}</span>`), 260 * (i + 1)));
    },
    brewideas() {
      ['brewing… grounds → ideas', 'community: online', 'future resolved: Infinity ✓']
        .forEach((s, i) => setTimeout(() => print('› <span class="ok">' + s + '</span>'), 220 * (i + 1)));
    },
  };

  function go(href) { setTimeout(() => { location.href = href; }, 520); }

  function run(raw) {
    const line = raw.trim();
    if (!line) return;
    history.unshift(line); hpos = -1;
    echo(line);
    const cleaned = line.replace(/\(\)/g, '').replace(/[;]+$/, '');
    const [cmd, ...rest] = cleaned.split(/\s+/);
    const key = cmd.toLowerCase();
    if (commands[key]) commands[key](rest.join(' '));
    else if (key === 'run') (commands[rest.join('').toLowerCase()] || (() => print(`unknown routine: ${esc(rest.join(' '))}`, 'warn')))();
    else print(`command not found: <span class="warn">${esc(cmd)}</span> — try <span class="ok">help</span>`, 'warn');
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    run(input.value);
    input.value = '';
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp') { e.preventDefault(); hpos = Math.min(hpos + 1, history.length - 1); input.value = history[hpos] || ''; }
    if (e.key === 'ArrowDown') { e.preventDefault(); hpos = Math.max(hpos - 1, -1); input.value = hpos === -1 ? '' : history[hpos]; }
  });

  repl.querySelectorAll('[data-cmd]').forEach((chip) => {
    chip.addEventListener('click', () => { run(chip.dataset.cmd); input.focus(); });
  });

  // greeting
  print('<span class="ok">brewLab.js</span> ready — type <span class="accent">help</span> or tap a command', 'accent');
}
