// Board UI: tokens, dice, animations along the golden / purple paths, turns,
// computer players, and the setup, question and win dialogs.

import { CELL_CENTERS, ROUTES } from './board-data.js';
import { boardMarkup, heartPath, layoutBoardText, routePath, setBoardText } from './board-art.js';
import { FINAL_SQUARE, FINISH_RULES, createGame, isValidState, needsQuestion, planMove, rollDie, takeTurn } from './game.js';
import { QUESTIONS, QUESTION_BY_ID, shuffled } from './questions.js';
import { getLang, setLang, t } from './i18n.js';
import {
  canSpeak,
  isSoundEnabled,
  onVoicesChanged,
  setSoundEnabled,
  sfx,
  speak,
  stopSpeaking,
  unlockAudio,
} from './audio.js';

// Seat order and colours follow the four flowers in the control panel.
const COLORS = ['pink', 'gold', 'purple', 'blue'];
const TOKEN_STYLE = {
  pink: { fill: '#e8a1c0', edge: '#b25e88' },
  gold: { fill: '#f2c14c', edge: '#a57718' },
  purple: { fill: '#b49ddb', edge: '#7258ab' },
  blue: { fill: '#8fa8ea', edge: '#4f6cbf' },
};
const CONFETTI_COLORS = ['#ee7c9e', '#f4b72f', '#987ad8', '#8fa8ea', '#ffa0bc', '#ffe68f'];

// Where tokens rest relative to a heart's number badge (board pixels), for 1-4
// tokens sharing a square. They sit at the heart's tip so the number stays readable.
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

const EVENT_KINDS = ['moved', 'ladder', 'snake', 'blocked', 'bounced', 'spared', 'wrong'];
const BOT_ACCURACY = 0.7; // how often a computer player answers a heart question correctly
const GAME_KEY = 'journey-to-gratitude:game';
const PREFS_KEY = 'journey-to-gratitude:prefs';
const SVG_NS = 'http://www.w3.org/2000/svg';

// ?speed=2 plays animations twice as fast.
const speed = Math.min(20, Math.max(0.25, Number(new URLSearchParams(location.search).get('speed')) || 1));
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

const $ = (id) => document.getElementById(id);
const el = {
  boardArt: $('boardArt'),
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
  questionDialog: $('questionDialog'),
  answers: $('answers'),
  verdict: $('verdict'),
  why: $('why'),
  questionActions: $('questionActions'),
  questionRead: $('questionRead'),
  confetti: $('confetti'),
  btnSound: $('btnSound'),
  btnLang: $('btnLang'),
};

let game = null; // state from game.js
let setup = null; // { count, seats: [{ name, bot }] x4, finishRule, questions }
let tokens = []; // { g, player, x, y, s }
let busy = false;
let phase = 'idle'; // 'rolling' | 'moving' | 'answering'
let rolled = 0;
let lastEvent = null; // { kind, player, args } shown on the first status line
let botTimer = 0;
let generation = 0; // bumps when a new game starts, so stale animations stop
let deck = []; // question ids still to be asked, so questions don't repeat
let lastQuestionId = null;
// The open heart question: how to pick an answer, go on, or cancel it.
const quiz = { choose: null, proceed: null, cancel: null, speakText: '' };

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
    questions: true,
  };
}

function isValidSetup(s) {
  return (
    Boolean(s) &&
    [2, 3, 4].includes(s.count) &&
    Array.isArray(s.seats) &&
    s.seats.length === COLORS.length &&
    s.seats.every((seat) => seat && typeof seat.name === 'string' && typeof seat.bot === 'boolean') &&
    Object.values(FINISH_RULES).includes(s.finishRule) &&
    typeof s.questions === 'boolean'
  );
}

function gameFromSetup(s) {
  return createGame({
    players: s.seats.slice(0, s.count).map((seat, i) => ({ name: seat.name, color: COLORS[i], bot: seat.bot })),
    finishRule: s.finishRule,
    questions: s.questions,
  });
}

function saveGame() {
  writeStore(GAME_KEY, { version: 1, setup, game, lastEvent, deck });
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
        // wobble from side to side on the way down
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

// Little hearts float up from a golden path; dots trail down a purple one.
function spark(x, y, type) {
  const cx = x + (Math.random() - 0.5) * 18;
  const cy = y + (Math.random() - 0.5) * 18;
  const size = 3 + Math.random() * 4.5;
  const dot =
    type === 'ladder'
      ? svgEl('path', { d: heartPath(size * 1.4, cx, cy), class: `spark ${type}` })
      : svgEl('circle', { cx: cx.toFixed(1), cy: cy.toFixed(1), r: size.toFixed(1), class: `spark ${type}` });
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

// A glow and rings of light on the goal, with hearts rising from it.
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
  if (reducedMotion.matches) return;
  for (let i = 0; i < 14; i++) {
    const heart = svgEl('path', {
      d: heartPath(9 + Math.random() * 9, x + (Math.random() - 0.5) * 90, y - 20),
      fill: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
      class: 'burst-heart',
    });
    el.fxFront.append(heart);
    heart.animate(
      [
        { transform: 'translate(0px, 0px) scale(0.4)', opacity: 0 },
        { opacity: 1, offset: 0.2 },
        { transform: `translate(${(Math.random() - 0.3) * 260}px, ${-(90 + Math.random() * 160)}px) scale(1)`, opacity: 0 },
      ],
      { duration: 1600 + Math.random() * 900, delay: i * 90, easing: 'ease-out', fill: 'backwards' },
    ).onfinish = () => heart.remove();
  }
}

function rainHearts() {
  el.confetti.replaceChildren();
  if (reducedMotion.matches) return;
  for (let i = 0; i < 48; i++) {
    const drop = document.createElement('span');
    drop.className = 'confetti-drop';
    drop.style.left = `${Math.random() * 100}%`;
    drop.style.animationDelay = `${Math.random() * 1.8}s`;
    drop.style.setProperty('--d', `${3.4 + Math.random() * 3}s`);
    drop.style.setProperty('--dx', `${Math.round((Math.random() - 0.5) * 180)}px`);
    const heart = svgEl('svg', { class: 'confetti-heart', viewBox: '-12 -12 24 24' });
    heart.append(svgEl('path', { d: heartPath(11), fill: CONFETTI_COLORS[i % CONFETTI_COLORS.length] }));
    heart.style.animationDelay = `${-Math.random() * 2}s`;
    drop.append(heart);
    el.confetti.append(drop);
  }
  setTimeout(() => el.confetti.replaceChildren(), 9000);
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
    if (lastEvent.kind === 'ladder' || lastEvent.kind === 'spared') span.className = 'up';
    if (lastEvent.kind === 'snake' || lastEvent.kind === 'wrong') span.className = 'down';
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
  if (phase === 'answering') return t('answering', nameOf(player));
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
  if (move.jump?.type === 'ladder') add(` · ${t('logLadder', move.jump.from, move.jump.to)}`, 'up');
  if (move.spared) add(` · ${t('logSpared')}`, 'up');
  if (move.jump?.type === 'snake') {
    const text = move.answer === false ? t('logWrong', move.jump.from, move.jump.to) : t('logSnake', move.jump.from, move.jump.to);
    add(` · ${text}`, 'down');
  }
  if (move.won) add(` · ${t('logWin')}`, 'up');
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

// The words drawn on the board. The purple legend depends on whether this
// game asks questions.
function renderBoardText() {
  setBoardText(el.boardArt, {
    title: t('boardTitle'),
    subtitle: t('boardSubtitle'),
    legendUp: t('legendUp'),
    legendDown: t('legendDown', game ? game.questions : setup.questions),
    goal: t('goalLabel'),
    start: t('startLabel'),
  });
}

function applyStaticText() {
  document.documentElement.lang = t('htmlLang');
  document.title = t('pageTitle');
  for (const node of document.querySelectorAll('[data-i18n]')) node.textContent = t(node.dataset.i18n);
  el.boardArt.setAttribute('aria-label', t('boardAlt'));
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
  renderBoardText();
}

// ---------- turns ----------

function resultEvent(move) {
  const player = move.player;
  if (move.blocked) return { kind: 'blocked', player, args: [FINAL_SQUARE - move.from] };
  if (move.spared) return { kind: 'spared', player, args: [move.landed] };
  if (move.jump?.type === 'snake' && move.answer === false) return { kind: 'wrong', player, args: [move.jump.from, move.jump.to] };
  if (move.jump) return { kind: move.jump.type, player, args: [move.jump.from, move.jump.to] };
  if (move.bounced) return { kind: 'bounced', player, args: [move.from, move.to] };
  return { kind: 'moved', player, args: [move.from, move.to] };
}

async function animateSteps(player, plan, gen) {
  const tok = tokens[player.id];
  tok.g.classList.add('is-moving');
  const [ox, oy] = SLOTS[1][0];
  for (const square of plan.steps) {
    const [cx, cy] = CELL_CENTERS[square];
    await hop(tok, cx + ox, cy + oy);
    if (gen !== generation) return;
    sfx.step();
  }
  if (plan.blocked) {
    sfx.blocked();
    await shake(tok);
  }
}

async function animateJump(move, gen) {
  const tok = tokens[move.player];
  if (move.jump) {
    await wait(160);
    if (gen !== generation) return;
    await travel(tok, move.jump);
  } else if (move.spared) {
    spare(tok, move.landed);
    await wait(650);
  }
  tok.g.classList.remove('is-moving');
}

async function roll() {
  if (!game || busy || game.winner !== null) return;
  const gen = generation;
  busy = true;
  clearTimeout(botTimer);
  unlockAudio();
  const player = game.players[game.current];

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

  const plan = planMove(player.pos, value, game.finishRule);
  await animateSteps(player, plan, gen);
  if (gen !== generation) return;

  let answer = null;
  if (needsQuestion(game, value)) {
    phase = 'answering';
    renderStatus();
    pulse(plan.landed);
    sfx.question();
    await wait(550); // let everyone see the token arrive before the card covers the board
    if (gen !== generation) return;
    answer = await askQuestion(player, plan.landed, gen);
    if (gen !== generation) return;
  }

  const { state: next, move } = takeTurn(game, value, answer);
  await animateJump(move, gen);
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

// ---------- heart questions ----------

function drawQuestion() {
  if (!deck.length) {
    deck = shuffled(QUESTIONS.map((q) => q.id));
    // don't start the new round with the question that ended the last one
    if (deck.length > 1 && deck.at(-1) === lastQuestionId) [deck[0], deck[deck.length - 1]] = [deck.at(-1), deck[0]];
  }
  lastQuestionId = deck.pop();
  return QUESTION_BY_ID.get(lastQuestionId);
}

// The question in the current language, with its choices in display order.
function presentQuestion(q) {
  const text = q[getLang()];
  if (q.judge) {
    const [yes, no] = t('judgeChoices');
    return {
      judge: true,
      question: text.question,
      prompt: t('judgePrompt'),
      why: text.why,
      choices: [
        { emoji: '👍', label: yes, right: q.answer === true },
        { emoji: '👎', label: no, right: q.answer === false },
      ],
    };
  }
  return {
    judge: false,
    question: text.question,
    prompt: '',
    why: text.why,
    choices: shuffled(text.choices.map((label, i) => ({ emoji: q.emoji[i], label, right: i === 0 }))),
  };
}

function spokenText(shown) {
  const pause = getLang() === 'zh' ? '。' : '. ';
  const parts = [shown.question, shown.prompt, ...(shown.judge ? [] : shown.choices.map((c) => c.label))];
  return parts.filter(Boolean).join(pause);
}

function updateReadButton() {
  el.questionRead.hidden = !canSpeak(getLang());
}

// Shows a right-or-wrong question and resolves with whether it was answered
// correctly. Computer players answer on their own after a short think.
function askQuestion(player, square, gen) {
  const shown = presentQuestion(drawQuestion());
  const timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, duration(ms)));

  $('questionFlower').style.color = TOKEN_STYLE[player.color].fill;
  $('questionIntro').textContent = t('questionIntro', nameOf(player), square);
  $('questionText').textContent = shown.question;
  $('questionPrompt').textContent = shown.prompt;
  el.verdict.className = 'verdict';
  el.verdict.textContent = '';
  el.why.textContent = '';
  el.questionActions.hidden = true;
  el.answers.classList.toggle('judge', shown.judge);
  const buttons = shown.choices.map((choice, i) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'answer';
    button.disabled = player.bot;
    const emoji = document.createElement('span');
    emoji.className = 'answer-emoji';
    emoji.setAttribute('aria-hidden', 'true');
    emoji.textContent = choice.emoji;
    const label = document.createElement('span');
    label.className = 'answer-text';
    label.textContent = choice.label;
    const mark = document.createElement('span');
    mark.className = 'answer-mark';
    mark.setAttribute('aria-hidden', 'true');
    button.append(emoji, label, mark);
    button.addEventListener('click', () => quiz.choose?.(i));
    return button;
  });
  el.answers.replaceChildren(...buttons);
  quiz.speakText = spokenText(shown);
  updateReadButton();

  return new Promise((resolve) => {
    let settled = false;
    const finish = (right) => {
      if (settled) return;
      settled = true;
      timers.forEach(clearTimeout);
      Object.assign(quiz, { choose: null, proceed: null, cancel: null });
      stopSpeaking();
      if (el.questionDialog.open) el.questionDialog.close();
      resolve(right);
    };

    const reveal = (index) => {
      quiz.choose = null;
      stopSpeaking();
      const right = shown.choices[index].right;
      buttons.forEach((button, i) => {
        button.disabled = true;
        button.classList.remove('is-picked');
        if (shown.choices[i].right) button.classList.add('is-right');
        else if (i === index) button.classList.add('is-wrong');
        else button.classList.add('is-dim');
      });
      (right ? sfx.correct : sfx.wrong)();
      el.verdict.className = `verdict ${right ? 'good' : 'bad'}`;
      el.verdict.textContent = right ? t('correct') : t('incorrect');
      const correctLabel = shown.choices.find((c) => c.right).label;
      el.why.textContent = right ? shown.why : `${t('rightAnswer', correctLabel)}${getLang() === 'zh' ? '。' : '. '}${shown.why}`;
      el.questionActions.hidden = false;
      quiz.proceed = () => finish(right);
      if (player.bot) later(() => finish(right), 3200);
      else $('questionContinue').focus();
    };

    quiz.cancel = () => finish(false);
    openDialog(el.questionDialog);

    if (player.bot) {
      el.verdict.className = 'verdict thinking';
      el.verdict.textContent = t('botThinking', nameOf(player));
      later(() => {
        if (gen !== generation) return finish(false);
        const rightIndex = shown.choices.findIndex((c) => c.right);
        const others = shown.choices.map((_, i) => i).filter((i) => i !== rightIndex);
        const pick = Math.random() < BOT_ACCURACY ? rightIndex : others[Math.floor(Math.random() * others.length)];
        buttons[pick].classList.add('is-picked');
        later(() => reveal(pick), 600);
      }, 1800);
    } else {
      quiz.choose = reveal;
      buttons[0].focus();
      if (isSoundEnabled()) speak(quiz.speakText, getLang());
    }
  });
}

function pulse(square) {
  const [x, y] = CELL_CENTERS[square];
  for (let i = 0; i < 2; i++) {
    const ring = svgEl('circle', { cx: x, cy: y, r: 46, class: 'pulse-ring' });
    el.fxFront.append(ring);
    ring.animate(
      [
        { opacity: 0.95, transform: 'scale(0.7)' },
        { opacity: 0, transform: 'scale(2.1)' },
      ],
      { duration: duration(900), delay: i * duration(260), easing: 'ease-out', fill: 'backwards' },
    ).onfinish = () => ring.remove();
  }
}

function spare(tok, square) {
  const ring = svgEl('circle', { cx: tok.x, cy: tok.y, r: 42, class: 'burst-ring' });
  el.fxFront.append(ring);
  ring.animate(
    [
      { opacity: 0.95, transform: 'scale(0.6)' },
      { opacity: 0, transform: 'scale(2.4)' },
    ],
    { duration: duration(1000), easing: 'ease-out' },
  ).onfinish = () => ring.remove();
  floatText(square, t('floatSafe'), 'ladder');
}

async function celebrate(gen) {
  sfx.win();
  burst(FINAL_SQUARE);
  await wait(1300);
  if (gen !== generation) return;
  const winner = game.players[game.winner];
  $('winHeart').style.color = TOKEN_STYLE[winner.color].fill;
  $('winText').textContent = t('winText', nameOf(winner));
  $('winStats').textContent = t('winStats', winner.rolls);
  openDialog(el.winDialog);
  rainHearts();
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
  quiz.cancel?.();
  game = state;
  busy = false;
  phase = 'idle';
  lastEvent = last;
  el.fxBack.replaceChildren();
  el.fxFront.replaceChildren();
  buildTokens();
  layoutTokens(false);
  showFace(game.history.at(-1)?.roll ?? 5);
  renderBoardText();
  renderAll();
  saveGame();
  scheduleBot();
}

// ---------- dialogs ----------

function openDialog(dialog) {
  if (!dialog.open) dialog.showModal();
}

function anyDialogOpen() {
  return [el.setupDialog, el.rulesDialog, el.winDialog, el.questionDialog].some((dialog) => dialog.open);
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
  $('questionsOn').checked = setup.questions;
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
    questions: $('questionsOn').checked,
  };
}

// ---------- events ----------

function bindEvents() {
  el.dice.addEventListener('click', roll);

  document.addEventListener('keydown', (event) => {
    if (quiz.choose && /^[1-3]$/.test(event.key) && Number(event.key) <= el.answers.children.length) {
      event.preventDefault();
      quiz.choose(Number(event.key) - 1);
      return;
    }
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
  el.winDialog.addEventListener('close', () => el.confetti.replaceChildren());

  $('questionContinue').addEventListener('click', () => quiz.proceed?.());
  el.questionRead.addEventListener('click', () => speak(quiz.speakText, getLang()));
  // Escape can't skip a question; once it's answered, Escape moves on.
  el.questionDialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    quiz.proceed?.();
  });
  onVoicesChanged(updateReadButton);

  // The board's words are measured to line things up, so measure again once
  // the web fonts have arrived.
  const relayout = () => layoutBoardText(el.boardArt);
  document.fonts?.ready.then(relayout);
  document.fonts?.addEventListener?.('loadingdone', relayout);
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
  el.boardArt.innerHTML = boardMarkup();
  const prefs = readStore(PREFS_KEY) ?? {};
  setLang(prefs.lang ?? (navigator.language?.toLowerCase().startsWith('zh') ? 'zh' : 'en'));
  setSoundEnabled(prefs.sound ?? true);

  const saved = readStore(GAME_KEY);
  setup = isValidSetup(saved?.setup) ? saved.setup : defaultSetup();
  applyStaticText();
  bindEvents();

  deck = Array.isArray(saved?.deck) ? saved.deck.filter((id) => QUESTION_BY_ID.has(id)) : [];
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
