// ── DATA ────────────────────────────────────────────────────────────────────

const SOCIALS = {
  github:   { url: 'https://github.com/usmanzahidcode',   label: 'GitHub'   },
  linkedin: { url: 'https://linkedin.com/in/usmanzahid',  label: 'LinkedIn' },
  x:        { url: 'https://x.com/UsmanZ_',               label: 'X (Twitter)' },
  twitter:  { url: 'https://x.com/UsmanZ_',               label: 'Twitter'  },
  email:    { url: 'mailto:usmanzahidx03@gmail.com',      label: 'Email'    },
  blog:     { url: 'https://dev.to/',                     label: 'Blog (dev.to)' },
};

const COMMANDS = {
  help: {
    desc: 'list all available commands',
    usage: 'help',
  },
  intro: {
    desc: 'about me — who I am and what I do',
    usage: 'intro',
  },
  social: {
    desc: 'open a social profile  (e.g. social github)',
    usage: 'social [github|linkedin|x|email|blog]',
  },
  links: {
    desc: 'show all links at once',
    usage: 'links',
  },
  whoami: {
    desc: 'quick one-liner about me',
    usage: 'whoami',
  },
  skills: {
    desc: 'tech stack and tooling I work with',
    usage: 'skills',
  },
  clear: {
    desc: 'clear the terminal screen',
    usage: 'clear',
  },
  echo: {
    desc: 'print text back (just for fun)',
    usage: 'echo [text]',
  },
};

// ── BOOT SEQUENCE ───────────────────────────────────────────────────────────

const BOOT_LINES = [
  { text: 'BIOS v2.4.1  —  Usman Portfolio Systems',         delay: 0,    color: 'var(--muted)' },
  { text: 'Copyright (C) 2024  UZ Labs. All rights reserved.',delay: 80,   color: 'var(--muted)' },
  { text: '',                                                  delay: 120  },
  { text: 'Detecting hardware ...',                           delay: 200  },
  { text: '  CPU : backend-core™  @  2.8 GHz  ×  8',        delay: 320  },
  { text: '  MEM : 32 GB  (ECC)                    [ OK ]',  delay: 420, color: 'var(--green)' },
  { text: '  DSK : /dev/sda  512 GB  NVMe           [ OK ]', delay: 520, color: 'var(--green)' },
  { text: '',                                                  delay: 600  },
  { text: 'Loading kernel ...',                               delay: 680  },
  { text: '[    0.000000] Booting Linux kernel 6.8.0-uz',    delay: 780,  color: 'var(--dim)'  },
  { text: '[    0.184231] ACPI: IRQ0 used by override.',     delay: 860,  color: 'var(--dim)'  },
  { text: '[    0.312800] PCI: Using configuration type 1',  delay: 920,  color: 'var(--dim)'  },
  { text: '[    0.561033] NET: Registered PF_INET6 protocol',delay: 980,  color: 'var(--dim)'  },
  { text: '[    0.702100] io scheduler mq-deadline registered',delay:1040, color: 'var(--dim)' },
  { text: '[    1.011400] EXT4-fs: mounted filesystem',      delay:1120,  color: 'var(--dim)'  },
  { text: '',                                                  delay:1200  },
  { text: 'Starting services ...',                            delay:1280  },
  { text: '  [  OK  ] Started portfolio.service',            delay:1380,  color: 'var(--green)'},
  { text: '  [  OK  ] Started ssh.service',                  delay:1460,  color: 'var(--green)'},
  { text: '  [  OK  ] Started nginx.service',                delay:1540,  color: 'var(--green)'},
  { text: '  [  OK  ] Reached target multi-user.target',     delay:1660,  color: 'var(--green)'},
  { text: '',                                                  delay:1740  },
  { text: 'Ubuntu 24.04.1 LTS  usman-portfolio tty1',        delay:1820  },
  { text: '',                                                  delay:1860  },
  { text: 'usman-portfolio login: usman',                    delay:1960  },
  { text: 'Password: ',                                       delay:2240  },
  { text: '',                                                  delay:2700  },
  { text: 'Last login: Fri Jun 27 00:00:00 2025 from 127.0.0.1', delay:2780, color:'var(--muted)'},
  { text: '',                                                  delay:2900  },
];

// ── DOM REFS ─────────────────────────────────────────────────────────────────

const bootScreen  = document.getElementById('boot-screen');
const bootLog     = document.getElementById('boot-log');
const terminal    = document.getElementById('terminal');
const output      = document.getElementById('output');
const inputDisplay = document.getElementById('input-display');
const ghostText   = document.getElementById('ghost-text');

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

  // completing a top-level command
  if (parts.length === 1) {
    const match = Object.keys(COMMANDS).find(c => c.startsWith(lower) && c !== lower);
    return match ? match.slice(lower.length) : '';
  }

  // completing social argument
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
    ' _   _                             ______     _     _     _ ',
    '| | | |                            |___  /    | |   (_)   | |',
    '| | | |___ _ __ ___   __ _ _ __       / / __ | |__  _  __| |',
    "| | | / __| '_ ` _ \\ / _` | '_ \\     / / '_ \\| '_ \\| |/ _` |",
    '| |_| \\__ \\ | | | | | (_| | | | |   / /| | | | | | | | (_| |',
    " \\___/|___/_| |_| |_|\\__,_|_| |_|  /_/ |_| |_|_| |_|_|\\__,_|",
  ].join('\n'));
  appendBlank();
  appendLine('line-section', '── about ──');
  appendBlank();

  const kvs = [
    ['name',       'Usman Zahid'],
    ['role',       'Backend Engineer'],
    ['location',   'Pakistan 🇵🇰'],
    ['focus',      'Systems · Deployments · Infrastructure'],
    ['available',  'Open to opportunities'],
  ];
  for (const [k, v] of kvs) {
    const row = el('div', 'kv-row');
    row.innerHTML = `<span class="line-key">${k}</span><span class="line-val">${v}</span>`;
    output.appendChild(row);
  }

  appendBlank();
  appendLine('line-section', '── bio ──');
  appendBlank();
  appendLine('line', 'I build backend services for production environments, where reliability');
  appendLine('line', 'and structure matter more than speed.  Work typically spans APIs,');
  appendLine('line', 'service design, and data flow between distributed components.');
  appendBlank();
  appendLine('line', 'I also work on deployment pipelines, containerised services, and');
  appendLine('line', 'server-side config — with a focus on predictable releases and');
  appendLine('line', 'repeatable environments.');
  appendBlank();
  appendLine('line-hint', 'Run `social` to find me online, or `skills` to see my stack.');
  appendBlank();
}

function runWhoami() {
  appendBlank();
  appendLine('line', 'usman — backend engineer who turns infrastructure into reliable systems.');
  appendBlank();
}

function runSkills() {
  appendBlank();
  appendLine('line-section', '── skills & stack ──');
  appendBlank();

  const cats = [
    ['languages',    'PHP · Python · JavaScript / TypeScript · Bash'],
    ['frameworks',   'Laravel · Node.js · Express · FastAPI'],
    ['databases',    'MySQL · PostgreSQL · Redis · MongoDB'],
    ['devops',       'Docker · Nginx · GitHub Actions · Linux'],
    ['cloud',        'DigitalOcean · AWS (EC2, S3, RDS)'],
    ['tools',        'Git · Composer · REST · WebSockets'],
  ];
  for (const [k, v] of cats) {
    const row = el('div', 'kv-row');
    row.innerHTML = `<span class="line-key">${k}</span><span class="line-val">${v}</span>`;
    output.appendChild(row);
  }
  appendBlank();
}

function runLinks() {
  appendBlank();
  appendLine('line-section', '── links ──');
  appendBlank();
  for (const [name, { url, label }] of Object.entries(SOCIALS)) {
    const row = el('div', 'social-row');
    row.innerHTML = `<span class="social-name">${label}</span><a class="social-url" href="${url}" target="_blank" rel="noopener">${url}</a>`;
    output.appendChild(row);
  }
  appendBlank();
}

function runSocial(args) {
  const name = args[0]?.toLowerCase();

  if (!name) {
    appendBlank();
    appendLine('line-hint', 'Usage: social [' + Object.keys(SOCIALS).join('|') + ']');
    appendBlank();
    return;
  }

  // fuzzy: find first key that starts with the given prefix
  const key = Object.keys(SOCIALS).find(k => k.startsWith(name));

  if (!key) {
    appendBlank();
    appendLine('line-error', `social: unknown profile "${name}"`);
    appendLine('line-hint', 'Try: ' + Object.keys(SOCIALS).join(', '));
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
    case 'links':  runLinks();       break;
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
    if (histIdx < history.length - 1) {
      histIdx++;
      buffer = history[histIdx];
      updateDisplay();
    }
    return;
  }

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    if (histIdx > 0) {
      histIdx--;
      buffer = history[histIdx];
    } else {
      histIdx = -1;
      buffer = '';
    }
    updateDisplay();
    return;
  }

  // ignore modifier-only keys
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
  for (const line of BOOT_LINES) {
    await new Promise(r => setTimeout(r, line.delay ? 0 : 0));

    const span = document.createElement('span');
    if (line.color) span.style.color = line.color;
    span.textContent = line.text + '\n';
    bootLog.appendChild(span);
    bootScreen.scrollTop = bootScreen.scrollHeight;

    // stagger each line
    await new Promise(r => setTimeout(r, line.delay ?? 60));
  }

  // fade out boot screen
  await new Promise(r => setTimeout(r, 300));
  bootScreen.style.transition = 'opacity 0.5s ease';
  bootScreen.style.opacity = '0';
  await new Promise(r => setTimeout(r, 500));
  bootScreen.style.display = 'none';

  // show terminal
  terminal.classList.remove('hidden');
  runIntro();
  scrollBottom();
}

runBoot();
