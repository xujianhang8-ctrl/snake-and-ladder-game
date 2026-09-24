// Board UI: tokens, dice, animations along the golden / purple paths, turns,
// computer players, setup and win dialogs.

import { CELL_CENTERS, ROUTES } from './board-data.js';
import { FINAL_SQUARE, FINISH_RULES, createGame, isValidState, rollDie, takeTurn } from './game.js';
import { getLang, setLang, t } from './i18n.js';
import { isSoundEnabled, setSoundEnabled, sfx, unlockAudio } from './audio.js';

// Seat order and colours follow the four flowers in the board's control panel.
const COLORS = ['pink', 'gold', 'purple', 'blue'];
const TOKEN_STYLE = {
  pink: { fill: '#e8a1c0', edge: '#b25e88' },
  gold: { fill: '#f2c14c', edge: '#a57718' },
  purple: { fill: '#b49ddb', edge: '#7258ab' },
  blue: { fill: '#8fa8ea', edge: '#4f6cbf' },
};
const PETAL_COLORS = ['#e8a1c0', '#f2c14c', '#b49ddb', '#8fa8ea', '#f7da8a', '#f4bfd4'];

// Where tokens rest relative to a lotus badge (board pixels), for 1-4 tokens
// sharing a square. They sit on the lily pad so the number stays readable.
const SLOTS = {
  1: [[0, 51]],
  2: [[-29, 49], [29, 49]],
  3: [[-40, 46], [0, 56], [40, 46]],
  4: [[-48, 43], [-17, 54], [17, 54], [48, 43]],
};
const TOKEN_SIZE = 1.2; // token artwork is drawn at unit scale, ~66 board px across
const STACK_SCALE = { 1: 1, 2: 0.92, 3: 0.84, 4: 0.78 };

const FACES = {
  1: ['c'],
  2: ['tr', 'bl'],
  3: ['tr', 'c', 'bl'],
  4: ['tl', 'tr', 'bl', 'br'],
  5: ['tl', 'tr', 'c', 'bl', 'br'],
  6: ['tl', 'tr', 'ml', 'mr', 'bl', 'br'],
};

const EVENT_KINDS = ['moved', 'ladder', 'snake', 'blocked', 'bounced'];
const GAME_KEY = 'lotus-karma:game';
const PREFS_KEY = 'lotus-karma:prefs';
const SVG_NS = 'http://www.w3.org/2000/svg';

// ?speed=2 plays animations twice as fast.
const speed = Math.min(20, Math.max(0.25, Number(new URLSearchParams(location.search).get('speed')) || 1));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const $ = (id) => document.getElementById(id);
const el = {
  dice: $('dice'),
  pips: [...document.querySelectorAll('#dice .pip')],
  flowers: [...document.querySelectorAll('#flowers .flower')],
  statusLast: $('statusLast'),
  statusNow: $('statusNow'),
  tokens: $('tokens'),
  fxBack: $('fxBack'),
  fxFront: $('fxFront'),
  playerList: $('playerList'),
  logList: $('logList'),
  logEmpty: $('logEmpty'),
  setupDialog: $('setupDialog'),
  setupForm: $('setupForm'),
  rulesDialog: $('rulesDialog'),
  winDialog: $('winDialog'),
  petals: $('petals'),
  btnSound: $('btnSound'),
  btnLang: $('btnLang'),
};

let game = null; // state from game.js
let setup = null; // { count, seats: [{ name, bot }] x4, finishRule }
let tokens = []; // { g, player, x, y, s }
let busy = false;
let phase = 'idle'; // 'rolling' | 'moving'
let rolled = 0;
let lastEvent = null; // { kind, player, args } shown on the first status line
let botTimer = 0;
let generation = 0; // bumps when a new game starts, so stale animations stop

// ---------- helpers ----------

const easeInOut = (p) => (p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2);
const easeInOutSine = (p) => -(Math.cos(Math.PI * p) - 1) / 2;
const easeOut = (p) => 1 - (1 - p) ** 3;
const easeSlide = (p) => p * p * (1.6 - 0.6 * p);

function duration(base) {
  return (base * (reducedMotion.matches ? 0.2 : 1)) / speed;
}

function wait(base) {
  return new Promise((resolve) => setTimeout(resolve, duration(base)));
}

function tween(ms, onFrame, ease = easeInOut) {
  return new Promise((resolve) => {
    const start = performance.now();
    const frame = (now) => {
      // rAF timestamps can precede `start`, so clamp to [0, 1]
      const p = ms <= 0 ? 1 : Math.min(1, Math.max(0, (now - start) / ms));
      onFrame(ease(p), p);
      if (p < 1) requestAnimationFrame(frame);
      else resolve();
    };
    requestAnimationFrame(frame);
  });
}

function svgEl(tag, attrs = {}) {
  const node = document.createElementNS(SVG_NS, tag);
  for (const [key, value] of Object.entries(attrs)) node.setAttribute(key, value);
  return node;
}

function readStore(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStore(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private windows); the game still plays.
  }
}

function colorName(color) {
  return t('colors')[COLORS.indexOf(color)] ?? color;
}

function nameOf(player) {
  return player.name || colorName(player.color);
}

// ---------- setup ----------

function defaultSetup() {
  return {
    count: 2,
    seats: COLORS.map((_, i) => ({ name: '', bot: i > 0 })),
    finishRule: FINISH_RULES.EXACT,
  };
}

function isValidSetup(s) {
  return (
    Boolean(s) &&
    [2, 3, 4].includes(s.count) &&
    Array.isArray(s.seats) &&
    s.seats.length === COLORS.length &&
    s.seats.every((seat) => seat && typeof seat.name === 'string' && typeof seat.bot === 'boolean') &&
    Object.values(FINISH_RULES).includes(s.finishRule)
  );
}

function gameFromSetup(s) {
  return createGame({
    players: s.seats.slice(0, s.count).map((seat, i) => ({ name: seat.name, color: COLORS[i], bot: seat.bot })),
    finishRule: s.finishRule,
  });
}

function saveGame() {
  writeStore(GAME_KEY, { version: 1, setup, game, lastEvent });
}

function savePrefs() {
  writeStore(PREFS_KEY, { lang: getLang(), sound: isSoundEnabled() });
}

// ---------- tokens ----------

function petalGroup(grow, fill) {
  const g = svgEl('g', { fill });
  const d = 14;
  const a = 10.5 + grow;
  const b = 13.5 + grow;
  g.append(
    svgEl('ellipse', { cx: 0, cy: -d, rx: a, ry: b }),
    svgEl('ellipse', { cx: d, cy: 0, rx: b, ry: a }),
    svgEl('ellipse', { cx: 0, cy: d, rx: a, ry: b }),
    svgEl('ellipse', { cx: -d, cy: 0, rx: b, ry: a }),
  );
  return g;
}

function buildTokens() {
  el.tokens.replaceChildren();
  tokens = game.players.map((player) => {
    const style = TOKEN_STYLE[player.color];
    const g = svgEl('g', { class: 'token' });
    const inner = svgEl('g', { class: 'token-inner' });
    inner.append(
      svgEl('circle', { class: 'token-halo', r: 52, fill: 'url(#tokenHalo)' }),
      svgEl('ellipse', { cx: 0, cy: 31, rx: 31, ry: 9, fill: 'url(#tokenShadow)' }),
      petalGroup(5.5, style.edge),
      petalGroup(4, '#fffaf0'),
      petalGroup(0, style.fill),
      svgEl('circle', { r: 6.5, fill: '#fdf1cf', stroke: style.edge, 'stroke-width': 1.5 }),
    );
    g.append(inner);
    el.tokens.append(g);
    return { g, player: player.id, x: 0, y: 0, s: 1 };
  });
}

function placeToken(tok, x, y, s = tok.s) {
  tok.x = x;
  tok.y = y;
  tok.s = s;
  tok.g.setAttribute('transform', `translate(${x.toFixed(1)} ${y.toFixed(1)}) scale(${(s * TOKEN_SIZE).toFixed(3)})`);
}

function activeId() {
  return game.winner ?? game.current;
}

function restingSpots() {
  const bySquare = new Map();
  for (const p of game.players) {
    if (!bySquare.has(p.pos)) bySquare.set(p.pos, []);
    bySquare.get(p.pos).push(p.id);
  }
  const spots = [];
  for (const [square, ids] of bySquare) {
    const n = Math.min(ids.length, 4);
    const [cx, cy] = CELL_CENTERS[square];
    ids.forEach((id, k) => {
      const [dx, dy] = SLOTS[n][k];
      spots[id] = { x: cx + dx, y: cy + dy, s: STACK_SCALE[n] };
    });
  }
  return spots;
}

// Paint order: lower tokens over higher ones, the active player's on top.
function orderTokens(spots) {
  const active = activeId();
  const order = [...tokens].sort(
    (a, b) => (a.player === active) - (b.player === active) || spots[a.player].y - spots[b.player].y,
  );
  // Only touch the DOM when the order changes; re-inserting restarts the token animations.
  if (order.some((tok, i) => el.tokens.children[i] !== tok.g)) order.forEach((tok) => el.tokens.append(tok.g));
}

function layoutTokens(animate) {
  const spots = restingSpots();
  orderTokens(spots);
  if (!animate) {
    tokens.forEach((tok) => placeToken(tok, spots[tok.player].x, spots[tok.player].y, spots[tok.player].s));
    return Promise.resolve();
  }
  const from = tokens.map((tok) => ({ x: tok.x, y: tok.y, s: tok.s }));
  return tween(
    duration(280),
    (e) =>
      tokens.forEach((tok, i) => {
        const a = from[i];
        const b = spots[tok.player];
        placeToken(tok, a.x + (b.x - a.x) * e, a.y + (b.y - a.y) * e, a.s + (b.s - a.s) * e);
      }),
    easeOut,
  );
}

function hop(tok, x, y) {
  const a = { x: tok.x, y: tok.y, s: tok.s };
  const lift = Math.min(46, 20 + Math.hypot(x - a.x, y - a.y) * 0.18);
  return tween(duration(240), (e, p) => {
    placeToken(tok, a.x + (x - a.x) * e, a.y + (y - a.y) * e - Math.sin(Math.PI * p) * lift, a.s + (1 - a.s) * e);
  });
}

function shake(tok) {
  const { x, y } = tok;
  return tween(duration(420), (e, p) => placeToken(tok, x + Math.sin(p * Math.PI * 6) * 9 * (1 - p), y), (p) => p);
}

// Smooth curve (Catmull-Rom) through a route's points, as an SVG path.
function routePath(points) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

async function travel(tok, jump) {
  const ladder = jump.type === 'ladder';
  const d = routePath(ROUTES[`${jump.from}-${jump.to}`]);
  const glow = svgEl('path', { d, class: `route-glow ${jump.type}` });
  const core = svgEl('path', { d, class: `route-core ${jump.type}` });
  el.fxBack.append(glow, core);
  const len = core.getTotalLength();
  for (const path of [glow, core]) {
    path.style.strokeDasharray = `${len} ${len}`;
    path.style.strokeDashoffset = `${len}`;
  }
  (ladder ? sfx.ladder : sfx.snake)();

  const [ox, oy] = SLOTS[1][0];
  let lastSpark = 0;
  const ms = duration(Math.min(2300, Math.max(1100, len * (ladder ? 3.3 : 2.7))));
  await tween(
    ms,
    (e, p) => {
      const at = len * e;
      const pt = core.getPointAtLength(at);
      let x = pt.x + ox;
      let y = pt.y + oy;
      if (!ladder) {
        // slither from side to side on the way down
        const next = core.getPointAtLength(Math.min(len, at + 1));
        const nx = pt.y - next.y;
        const ny = next.x - pt.x;
        const nl = Math.hypot(nx, ny) || 1;
        const w = Math.sin(p * Math.PI * 7) * 11 * Math.sin(Math.PI * p);
        x += (nx / nl) * w;
        y += (ny / nl) * w;
      }
      placeToken(tok, x, y, 1);
      glow.style.strokeDashoffset = core.style.strokeDashoffset = `${len - at}`;
      const now = performance.now();
      if (now - lastSpark > 45 && !reducedMotion.matches) {
        lastSpark = now;
        spark(pt.x, pt.y, jump.type);
      }
    },
    ladder ? easeInOutSine : easeSlide,
  );
  floatText(jump.to, ladder ? `+${jump.to - jump.from}` : `−${jump.from - jump.to}`, jump.type);
  glow.classList.add('route-fade');
  core.classList.add('route-fade');
  setTimeout(() => {
    glow.remove();
    core.remove();
  }, 900);
}

function spark(x, y, type) {
  const dot = svgEl('circle', {
    cx: (x + (Math.random() - 0.5) * 18).toFixed(1),
    cy: (y + (Math.random() - 0.5) * 18).toFixed(1),
    r: (3 + Math.random() * 4.5).toFixed(1),
    class: `spark ${type}`,
  });
  el.fxBack.append(dot);
  const dx = (Math.random() - 0.5) * 30;
  const dy = type === 'ladder' ? -(20 + Math.random() * 32) : 14 + Math.random() * 24;
  dot.animate(
    [
      { transform: 'translate(0px, 0px) scale(1)', opacity: 0.95 },
      { transform: `translate(${dx}px, ${dy}px) scale(0.2)`, opacity: 0 },
    ],
    { duration: 650 + Math.random() * 350, easing: 'ease-out' },
  ).onfinish = () => dot.remove();
}

function floatText(square, text, type) {
  const [x, y] = CELL_CENTERS[square];
  const label = svgEl('text', { x, y: y - 44, class: `float-text ${type}`, 'text-anchor': 'middle' });
  label.textContent = text;
  el.fxFront.append(label);
  label.animate(
    [
      { transform: 'translateY(12px)', opacity: 0 },
      { transform: 'translateY(0px)', opacity: 1, offset: 0.2 },
      { transform: 'translateY(0px)', opacity: 1, offset: 0.6 },
      { transform: 'translateY(-40px)', opacity: 0 },
    ],
    { duration: duration(1900), easing: 'ease-out' },
  ).onfinish = () => label.remove();
}

function burst(square) {
  const [x, y] = CELL_CENTERS[square];
  const glow = svgEl('circle', { cx: x, cy: y, r: 170, fill: 'url(#burst)', class: 'burst-glow' });
  el.fxBack.append(glow);
  glow.animate(
    [
      { opacity: 0, transform: 'scale(0.3)' },
      { opacity: 1, transform: 'scale(1)', offset: 0.3 },
      { opacity: 0, transform: 'scale(1.3)' },
    ],
    { duration: 2400, easing: 'ease-out' },
  ).onfinish = () => glow.remove();
  for (let i = 0; i < 3; i++) {
    const ring = svgEl('circle', { cx: x, cy: y, r: 60, class: 'burst-ring' });
    el.fxFront.append(ring);
    ring.animate(
      [
        { opacity: 0.95, transform: 'scale(0.6)' },
        { opacity: 0, transform: 'scale(3.2)' },
      ],
      { duration: 1500, delay: i * 300, easing: 'ease-out', fill: 'backwards' },
    ).onfinish = () => ring.remove();
  }
}

function rainPetals() {
  el.petals.replaceChildren();
  if (reducedMotion.matches) return;
  for (let i = 0; i < 48; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.style.left = `${Math.random() * 100}%`;
    petal.style.animationDelay = `${Math.random() * 1.8}s`;
    petal.style.setProperty('--d', `${3.4 + Math.random() * 3}s`);
    petal.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 180)}px`);
    const leaf = document.createElement('i');
    leaf.style.setProperty('--c', PETAL_COLORS[i % PETAL_COLORS.length]);
    leaf.style.animationDelay = `${-Math.random() * 2}s`;
    petal.append(leaf);
    el.petals.append(petal);
  }
  setTimeout(() => el.petals.replaceChildren(), 9000);
}

// ---------- dice ----------

function showFace(n) {
  const on = FACES[n];
  for (const pip of el.pips) pip.style.visibility = on.includes(pip.dataset.pip) ? 'visible' : 'hidden';
}

async function animateDice(value) {
  sfx.dice();
  el.dice.classList.remove('ready', 'landed');
  el.dice.classList.add('rolling');
  let last = 0;
  let face = 0;
  await tween(duration(760), () => {
    const now = performance.now();
    if (now - last < 75) return;
    last = now;
    let next;
    do next = 1 + Math.floor(Math.random() * 6);
    while (next === face);
    face = next;
    showFace(face);
  });
  el.dice.classList.remove('rolling');
  showFace(value);
  el.dice.classList.add('landed');
}

// ---------- rendering ----------

function renderStatus() {
  el.statusLast.replaceChildren();
  if (lastEvent) {
    const span = document.createElement('span');
    span.textContent = t(lastEvent.kind, nameOf(game.players[lastEvent.player]), ...lastEvent.args);
    if (lastEvent.kind === 'ladder') span.className = 'merit';
    if (lastEvent.kind === 'snake') span.className = 'karma';
    el.statusLast.append(span);
  }
  el.statusNow.textContent = nowText();
}

function nowText() {
  if (!game) return '';
  if (game.winner !== null) return t('won', nameOf(game.players[game.winner]));
  const player = game.players[game.current];
  if (phase === 'rolling') return t('rolling', nameOf(player));
  if (phase === 'moving') return t('rolled', nameOf(player), rolled);
  return player.bot ? t('turnBot', nameOf(player)) : t('turnHuman', nameOf(player));
}

function renderDice() {
  const player = game.players[game.current];
  const canRoll = game.winner === null && !busy && !player.bot;
  el.dice.disabled = !canRoll;
  el.dice.classList.toggle('ready', canRoll);
  el.dice.setAttribute('aria-label', t('dice'));
  el.dice.title = canRoll ? t('diceHint') : '';
}

function renderFlowers() {
  const active = activeId();
  el.flowers.forEach((flower, i) => {
    const player = game.players[i];
    flower.classList.toggle('out', !player);
    flower.classList.toggle('current', Boolean(player) && i === active);
    flower.title = player ? `${nameOf(player)} · ${t('square', player.pos)}` : '';
  });
  const current = game.winner === null ? game.current : -1;
  tokens.forEach((tok) => tok.g.classList.toggle('is-current', tok.player === current));
}

function chip() {
  const svg = svgEl('svg', { class: 'chip', 'aria-hidden': 'true' });
  svg.append(svgEl('use', { href: '#flower' }));
  return svg;
}

function renderPlayers() {
  const active = activeId();
  el.playerList.replaceChildren(
    ...game.players.map((player) => {
      const li = document.createElement('li');
      li.className = 'player';
      li.dataset.color = player.color;
      if (player.id === active) {
        li.classList.add('is-current');
        li.setAttribute('aria-current', 'true');
      }
      const who = document.createElement('span');
      who.className = 'player-who';
      const name = document.createElement('span');
      name.className = 'player-name';
      name.textContent = nameOf(player);
      who.append(name);
      if (player.bot) {
        const tag = document.createElement('span');
        tag.className = 'player-tag';
        tag.textContent = t('botTag');
        who.append(tag);
      }
      const pos = document.createElement('span');
      pos.className = 'player-pos';
      pos.textContent = t('square', player.pos);
      const bar = document.createElement('span');
      bar.className = 'player-bar';
      const fill = document.createElement('i');
      fill.style.setProperty('--p', player.pos);
      bar.append(fill);
      li.append(chip(), who, pos, bar);
      return li;
    }),
  );
}

function logText(move) {
  const parts = [];
  const add = (text, className) => {
    const span = document.createElement('span');
    span.textContent = text;
    if (className) span.className = className;
    parts.push(span);
  };
  const player = game.players[move.player];
  add(`${t('logRoll', nameOf(player), move.roll)} · `);
  if (move.blocked) add(t('logBlocked'), 'note');
  else add(t('logMove', move.from, move.landed));
  if (move.bounced) add(` (${t('logBounce')})`, 'note');
  if (move.jump?.type === 'ladder') add(` · ${t('logLadder', move.jump.from, move.jump.to)}`, 'merit');
  if (move.jump?.type === 'snake') add(` · ${t('logSnake', move.jump.from, move.jump.to)}`, 'karma');
  if (move.won) add(` · ${t('logWin')}`, 'merit');
  return parts;
}

function renderLog() {
  const recent = game.history.slice(-80).reverse();
  el.logList.replaceChildren(
    ...recent.map((move) => {
      const li = document.createElement('li');
      li.dataset.color = game.players[move.player].color;
      const text = document.createElement('span');
      text.append(...logText(move));
      li.append(chip(), text);
      return li;
    }),
  );
  el.logEmpty.hidden = recent.length > 0;
}

function renderAll() {
  renderStatus();
  renderDice();
  renderFlowers();
  renderPlayers();
  renderLog();
}

function renderSoundButton() {
  const on = isSoundEnabled();
  const label = on ? t('soundOn') : t('soundOff');
  el.btnSound.setAttribute('aria-pressed', String(on));
  el.btnSound.setAttribute('aria-label', label);
  el.btnSound.title = label;
  el.btnSound.querySelector('use').setAttribute('href', on ? '#i-sound' : '#i-mute');
}

function applyStaticText() {
  document.documentElement.lang = t('htmlLang');
  document.title = t('pageTitle');
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  $('boardArt').alt = t('boardAlt');
  el.btnLang.textContent = t('langSwitch');
  el.btnLang.setAttribute('aria-label', t('langSwitchLabel'));
  el.btnLang.lang = getLang() === 'zh' ? 'en' : 'zh-CN';
  COLORS.forEach((color, i) => {
    const input = $(`name${i}`);
    input.placeholder = colorName(color);
    input.setAttribute('aria-label', t('playerName', i + 1));
    $(`typeGroup${i}`).setAttribute('aria-label', t('playerType', i + 1));
  });
  const rules = $('rulesList');
  rules.replaceChildren();
  for (const item of t('rulesList')) {
    const li = document.createElement('li');
    li.innerHTML = item; // static, trusted markup from i18n.js
    rules.append(li);
  }
  renderSoundButton();
}

// ---------- turns ----------

function resultEvent(move) {
  const player = move.player;
  if (move.blocked) return { kind: 'blocked', player, args: [FINAL_SQUARE - move.from] };
  if (move.jump) return { kind: move.jump.type, player, args: [move.jump.from, move.jump.to] };
  if (move.bounced) return { kind: 'bounced', player, args: [move.from, move.to] };
  return { kind: 'moved', player, args: [move.from, move.to] };
}

async function animateMove(move, gen) {
  const tok = tokens[move.player];
  tok.g.classList.add('is-moving');
  const [ox, oy] = SLOTS[1][0];
  for (const square of move.steps) {
    const [cx, cy] = CELL_CENTERS[square];
    await hop(tok, cx + ox, cy + oy);
    if (gen !== generation) return;
    sfx.step();
  }
  if (move.blocked) {
    sfx.blocked();
    await shake(tok);
  }
  if (move.jump) {
    await wait(160);
    if (gen !== generation) return;
    await travel(tok, move.jump);
  }
  tok.g.classList.remove('is-moving');
}

async function roll() {
  if (!game || busy || game.winner !== null) return;
  const gen = generation;
  busy = true;
  clearTimeout(botTimer);
  unlockAudio();

  phase = 'rolling';
  renderStatus();
  renderDice();
  const value = rollDie();
  await animateDice(value);
  if (gen !== generation) return;

  rolled = value;
  phase = 'moving';
  renderStatus();
  await wait(200);
  if (gen !== generation) return;

  const { state: next, move } = takeTurn(game, value);
  await animateMove(move, gen);
  if (gen !== generation) return;

  game = next;
  phase = 'idle';
  lastEvent = resultEvent(move);
  saveGame();
  renderAll();
  await layoutTokens(true);
  if (gen !== generation) return;
  busy = false;
  renderDice();

  if (game.winner !== null) await celebrate(gen);
  else scheduleBot();
}

async function celebrate(gen) {
  sfx.win();
  burst(FINAL_SQUARE);
  await wait(1300);
  if (gen !== generation) return;
  const winner = game.players[game.winner];
  $('winFlower').style.color = TOKEN_STYLE[winner.color].fill;
  $('winText').textContent = t('winText', nameOf(winner));
  $('winStats').textContent = t('winStats', winner.rolls);
  openDialog(el.winDialog);
  rainPetals();
}

function scheduleBot() {
  clearTimeout(botTimer);
  if (!game || busy || game.winner !== null || !game.players[game.current].bot) return;
  botTimer = setTimeout(() => {
    if (anyDialogOpen()) scheduleBot();
    else roll();
  }, duration(950));
}

function startGame(state, last = null) {
  clearTimeout(botTimer);
  generation += 1;
  game = state;
  busy = false;
  phase = 'idle';
  lastEvent = last;
  el.fxBack.replaceChildren();
  el.fxFront.replaceChildren();
  buildTokens();
  layoutTokens(false);
  showFace(game.history.at(-1)?.roll ?? 5);
  renderAll();
  saveGame();
  scheduleBot();
}

// ---------- dialogs ----------

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function anyDialogOpen() {
  return [el.setupDialog, el.rulesDialog, el.winDialog].some((dialog) => dialog.open);
}

function updateSeats() {
  const count = Number(el.setupForm.elements.count.value);
  document.querySelectorAll('#seats .seat').forEach((seat, i) => {
    seat.hidden = i >= count;
  });
}

function openSetup() {
  $(`count${setup.count}`).checked = true;
  setup.seats.forEach((seat, i) => {
    $(`name${i}`).value = seat.name;
    $(`type${i}${seat.bot ? 'b' : 'h'}`).checked = true;
  });
  $(setup.finishRule === FINISH_RULES.BOUNCE ? 'finishBounce' : 'finishExact').checked = true;
  updateSeats();
  openDialog(el.setupDialog);
}

function readSetupForm() {
  const fields = el.setupForm.elements;
  return {
    count: Number(fields.count.value),
    seats: COLORS.map((_, i) => ({
      name: $(`name${i}`).value.trim().slice(0, 12),
      bot: fields[`type${i}`].value === 'bot',
    })),
    finishRule: fields.finish.value === FINISH_RULES.BOUNCE ? FINISH_RULES.BOUNCE : FINISH_RULES.EXACT,
  };
}

// ---------- events ----------

function bindEvents() {
  el.dice.addEventListener('click', roll);

  document.addEventListener('keydown', (event) => {
    if ((event.key !== ' ' && event.key !== 'Enter') || event.repeat || anyDialogOpen()) return;
    if (event.target.closest?.('button, input, select, textarea, a, [contenteditable]')) return;
    if (el.dice.disabled) return;
    event.preventDefault();
    roll();
  });

  document.addEventListener('pointerdown', unlockAudio, { once: true });

  $('btnNew').addEventListener('click', openSetup);
  $('btnRules').addEventListener('click', () => openDialog(el.rulesDialog));
  $('rulesClose').addEventListener('click', () => el.rulesDialog.close());

  el.btnSound.addEventListener('click', () => {
    setSoundEnabled(!isSoundEnabled());
    if (isSoundEnabled()) sfx.step();
    savePrefs();
    renderSoundButton();
  });

  el.btnLang.addEventListener('click', () => {
    setLang(getLang() === 'zh' ? 'en' : 'zh');
    savePrefs();
    applyStaticText();
    renderAll();
  });

  el.setupForm.addEventListener('change', (event) => {
    if (event.target.name === 'count') updateSeats();
  });
  el.setupForm.addEventListener('submit', (event) => {
    event.preventDefault();
    setup = readSetupForm();
    el.setupDialog.close();
    startGame(gameFromSetup(setup));
  });
  $('setupCancel').addEventListener('click', () => el.setupDialog.close());

  $('winAgain').addEventListener('click', () => {
    el.winDialog.close();
    startGame(gameFromSetup(setup));
  });
  $('winNew').addEventListener('click', () => {
    el.winDialog.close();
    openSetup();
  });

  for (const dialog of [el.setupDialog, el.rulesDialog, el.winDialog]) {
    dialog.addEventListener('close', () => {
      if (!anyDialogOpen()) scheduleBot();
    });
  }
  el.winDialog.addEventListener('close', () => el.petals.replaceChildren());
}

function restoredEvent(event, state) {
  const ok =
    event &&
    EVENT_KINDS.includes(event.kind) &&
    Number.isInteger(event.player) &&
    event.player >= 0 &&
    event.player < state.players.length &&
    Array.isArray(event.args) &&
    event.args.every(Number.isInteger);
  return ok ? event : null;
}

function init() {
  const prefs = readStore(PREFS_KEY) ?? {};
  setLang(prefs.lang ?? (navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'));
  setSoundEnabled(prefs.sound ?? true);
  applyStaticText();
  bindEvents();

  const saved = readStore(GAME_KEY);
  setup = isValidSetup(saved?.setup) ? saved.setup : defaultSetup();
  const resumable =
    saved &&
    isValidState(saved.game) &&
    saved.game.winner === null &&
    saved.game.players.length === setup.count &&
    saved.game.players.every((p, i) => p.color === COLORS[i]);
  if (resumable) startGame(saved.game, restoredEvent(saved.lastEvent, saved.game));
  else startGame(gameFromSetup(setup));
}

init();
