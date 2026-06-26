// ── DATA ────────────────────────────────────────────────────────────────────

const SOCIALS = {
  github:   { url: 'https://github.com/usmanzahidx03',        label: 'GitHub'    },
  linkedin: { url: 'https://linkedin.com/in/usmanzahidx03',   label: 'LinkedIn'  },
  x:        { url: 'https://x.com/UsmanZ_',                   label: 'X'         },
  email:    { url: 'mailto:usmanzahidx03@gmail.com',          label: 'Email'     },
};

const COMMANDS = {
  help:   { desc: 'list all available commands',                    usage: 'help'               },
  intro:  { desc: 'about me — who I am and what I do',             usage: 'intro'              },
  social: { desc: 'show all links, or open one  (e.g. social x)',  usage: 'social [name]'      },
  whoami: { desc: 'quick one-liner about me',                       usage: 'whoami'             },
  skills: { desc: 'tech stack and tooling I work with',             usage: 'skills'             },
  clear:  { desc: 'clear the terminal screen',                      usage: 'clear'              },
  echo:   { desc: 'print text back',                                usage: 'echo [text]'        },
};

// ── BOOT SEQUENCE ───────────────────────────────────────────────────────────

const BOOT_LINES = [
  { text: 'Ubuntu 24.04.1 LTS  usman-portfolio',              delay: 0    },
  { text: '',                                                   delay: 80   },
  { text: '  [  OK  ] Started portfolio.service',             delay: 160,  color: 'var(--green)' },
  { text: '  [  OK  ] Started nginx.service',                 delay: 280,  color: 'var(--green)' },
  { text: '  [  OK  ] Reached target multi-user.target',      delay: 400,  color: 'var(--green)' },
  { text: '',                                                   delay: 500  },
  { text: 'usman-portfolio login: usman',                     delay: 580  },
  { text: 'Password: ',                                        delay: 880  },
  { text: '',                                                   delay: 1200 },
  { text: 'Last login: Fri Jun 27 00:00:00 2025',             delay: 1280, color: 'var(--muted)' },
  { text: '',                                                   delay: 1360 },
];

// ── DOM REFS ─────────────────────────────────────────────────────────────────

const bootScreen   = document.getElementById('boot-screen');
const bootLog      = document.getElementById('boot-log');
const terminal     = document.getElementById('terminal');
const output       = document.getElementById('output');
const inputDisplay = document.getElementById('input-display');
const ghostText    = document.getElementById('ghost-text');

// ── HELPERS ──────────────────────────────────────────────────────────────────

function el(tag, cls, html) {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (html !== undefined) e.innerHTML = html;
  return e;
}

function appendLine(cls, html) {
  const d = el('div', `line ${cls}`, html ?? '');
  output.appendChild(d);
  scrollBottom();
  return d;
}

function appendBlank() { appendLine('line-blank'); }

function scrollBottom() {
  output.scrollTop = output.scrollHeight;
}

// ── AUTOCOMPLETE ─────────────────────────────────────────────────────────────

function getGhost(input) {
  if (!input) return '';
  const lower = input.toLowerCase();
  const parts  = lower.split(' ');

  if (parts.length === 1) {
    const match = Object.keys(COMMANDS).find(c => c.startsWith(lower) && c !== lower);
    return match ? match.slice(lower.length) : '';
  }

  if (parts[0] === 'social' && parts.length === 2) {
    const arg = parts[1];
    if (!arg) return '';
    const match = Object.keys(SOCIALS).find(s => s.startsWith(arg) && s !== arg);
    return match ? match.slice(arg.length) : '';
  }

  return '';
}

// ── COMMAND HANDLERS ─────────────────────────────────────────────────────────

function runHelp() {
  appendBlank();
  appendLine('line-section', '── available commands ──');
  appendBlank();
  for (const [name, meta] of Object.entries(COMMANDS)) {
    const row = el('div', 'cmd-row');
    row.innerHTML = `<span class="cmd-name">${name}</span><span class="cmd-desc">${meta.desc}</span>`;
    output.appendChild(row);
  }
  appendBlank();
  appendLine('line-hint', 'Tip: start typing and press Tab to autocomplete.');
  appendBlank();
}

function runIntro() {
  appendBlank();
  appendLine('ascii', [
    ' _   _                            ______     _     _     _ ',
    '| | | |___  _ __ ___   __ _ _ __ |___  /    | |   (_)   | |',
    "| | | / __|| '_ ` _ \\ / _`| '_ \\    / / __ | |__  _  __| |",
    '| |_| \\__ \\| | | | | | (_|| | | |  / / |_ || |_ || |/ _` |',
    ' \\___/|___/|_| |_| |_|\\__,||_| |_|/_/  \\__/ |_| ||_|\\__,_|',
  ].join('\n'));
  appendBlank();
  appendLine('line-section', '── about ──');
  appendBlank();

  const kvs = [
    ['name',      'Usman Zahid'],
    ['role',      'Backend Engineer'],
    ['location',  'Pakistan 🇵🇰'],
    ['focus',     'Systems · Deployments · Infrastructure'],
    ['status',    'Open to opportunities'],
  ];
  for (const [k, v] of kvs) {
    const row = el('div', 'kv-row');
    row.innerHTML = `<span class="line-key">${k}</span><span class="line-val">${v}</span>`;
    output.appendChild(row);
  }

  appendBlank();
  appendLine('line', 'I build backend services that hold up in production — APIs, distributed');
  appendLine('line', 'systems, deployment pipelines, and the infrastructure underneath them.');
  appendBlank();
  appendLine('line-hint', 'Try `social`, `skills`, or `help` to explore.');
  appendBlank();
}

function runWhoami() {
  appendBlank();
  appendLine('line', 'Backend engineer. I build systems that stay up, scale predictably,');
  appendLine('line', 'and don\'t require heroics to maintain.');
  appendBlank();
}

function runSkills() {
  appendBlank();
  appendLine('line-section', '── skills & stack ──');
  appendBlank();

  const cats = [
    ['languages',   'PHP · JavaScript · Python · .NET'],
    ['frameworks',  'Laravel · FastAPI'],
    ['databases',   'PostgreSQL · MySQL · Redis · MongoDB'],
    ['devops',      'Nginx · GitHub Actions · Linux · Docker'],
    ['cloud',       'Hetzner · DigitalOcean · AWS'],
    ['tools',       'PhpStorm · Git · Composer'],
  ];
  for (const [k, v] of cats) {
    const row = el('div', 'kv-row');
    row.innerHTML = `<span class="line-key">${k}</span><span class="line-val">${v}</span>`;
    output.appendChild(row);
  }
  appendBlank();
}

function runSocial(args) {
  const name = args[0]?.toLowerCase();

  // no argument → show all links + usage
  if (!name) {
    appendBlank();
    appendLine('line-hint', 'Usage: social [' + Object.keys(SOCIALS).join('|') + ']');
    appendBlank();
    appendLine('line-section', '── links ──');
    appendBlank();
    for (const [, { url, label }] of Object.entries(SOCIALS)) {
      const row = el('div', 'social-row');
      row.innerHTML = `<span class="social-name">${label}</span><a class="social-url" href="${url}" target="_blank" rel="noopener">${url}</a>`;
      output.appendChild(row);
    }
    appendBlank();
    return;
  }

  // fuzzy match prefix
  const key = Object.keys(SOCIALS).find(k => k.startsWith(name));

  if (!key) {
    appendBlank();
    appendLine('line-error', `social: unknown profile "${name}"`);
    appendLine('line-hint', 'Options: ' + Object.keys(SOCIALS).join(', '));
    appendBlank();
    return;
  }

  const { url, label } = SOCIALS[key];
  appendBlank();
  appendLine('line', `Opening <a class="social-url" href="${url}" target="_blank" rel="noopener">${label}</a> …`);
  appendBlank();
  window.open(url, '_blank', 'noopener');
}

function runEcho(args) {
  appendBlank();
  appendLine('line', args.join(' ') || '');
  appendBlank();
}

function runClear() {
  output.innerHTML = '';
}

function runUnknown(cmd) {
  appendBlank();
  appendLine('line-error', `bash: ${cmd}: command not found`);
  appendLine('line-hint', 'Type `help` to see available commands.');
  appendBlank();
}

// ── DISPATCH ─────────────────────────────────────────────────────────────────

function dispatch(raw) {
  const trimmed = raw.trim();
  if (!trimmed) return;

  appendLine('line-cmd', trimmed);

  const [cmd, ...args] = trimmed.split(/\s+/);

  switch (cmd.toLowerCase()) {
    case 'help':   runHelp();        break;
    case 'intro':  runIntro();       break;
    case 'whoami': runWhoami();      break;
    case 'skills': runSkills();      break;
    case 'social': runSocial(args);  break;
    case 'echo':   runEcho(args);    break;
    case 'clear':  runClear();       break;
    default:       runUnknown(cmd);  break;
  }
}

// ── INPUT HANDLING ────────────────────────────────────────────────────────────

let buffer  = '';
let history = [];
let histIdx = -1;

function updateDisplay() {
  inputDisplay.textContent = buffer;
  ghostText.textContent = getGhost(buffer);
}

document.addEventListener('keydown', (e) => {
  if (terminal.classList.contains('hidden')) return;

  if (e.key === 'Tab') {
    e.preventDefault();
    const ghost = getGhost(buffer);
    if (ghost) buffer += ghost;
    updateDisplay();
    return;
  }

  if (e.key === 'Enter') {
    const cmd = buffer;
    buffer = '';
    histIdx = -1;
    if (cmd.trim()) history.unshift(cmd);
    updateDisplay();
    dispatch(cmd);
    return;
  }

  if (e.key === 'Backspace') {
    buffer = buffer.slice(0, -1);
    updateDisplay();
    return;
  }

  if (e.key === 'ArrowUp') {
    e.preventDefault();
    if (histIdx < history.length - 1) { histIdx++; buffer = history[histIdx]; updateDisplay(); }
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) { histIdx--; buffer = history[histIdx]; }
    else { histIdx = -1; buffer = ''; }
    updateDisplay();
    return;
  }

  if (e.key.length > 1) return;

  if (e.ctrlKey || e.metaKey || e.altKey) {
    if (e.ctrlKey && e.key === 'l') { runClear(); return; }
    if (e.ctrlKey && e.key === 'c') { buffer = ''; updateDisplay(); appendLine('line-cmd', '^C'); return; }
    return;
  }

  buffer += e.key;
  updateDisplay();
});

// ── BOOT ANIMATION ────────────────────────────────────────────────────────────

async function runBoot() {
  let elapsed = 0;
  for (const line of BOOT_LINES) {
    const wait = (line.delay ?? 80) - elapsed;
    if (wait > 0) await new Promise(r => setTimeout(r, wait));
    elapsed = line.delay ?? 80;

    const span = document.createElement('span');
    if (line.color) span.style.color = line.color;
    span.textContent = line.text + '\n';
    bootLog.appendChild(span);
    bootScreen.scrollTop = bootScreen.scrollHeight;
  }

  await new Promise(r => setTimeout(r, 300));
  bootScreen.style.transition = 'opacity 0.5s ease';
  bootScreen.style.opacity = '0';
  await new Promise(r => setTimeout(r, 500));
  bootScreen.style.display = 'none';

  terminal.classList.remove('hidden');
  runIntro();
  scrollBottom();
}

runBoot();
