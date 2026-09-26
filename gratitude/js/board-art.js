// The board picture, drawn as SVG from the geometry in board-data.js: a cream
// frame, a sunrise sky over rolling meadow hills, the winding trail from 1 to
// 100, the golden and purple paths, a heart on every square, and a bunch of
// hearts floating over the goal. The markup is built as plain strings, so the
// tests can check it in Node; main.js puts it on the page and fills in the
// words in the chosen language.

import { BOARD_SIZE, CELL_CENTERS, LADDERS, ROUTES, SNAKES } from './board-data.js';

const W = BOARD_SIZE.width;
const H = BOARD_SIZE.height;
const MID = W / 2;
const FIELD = { x: 37.5, y: 202.5, w: 1323, h: 1525, r: 21 };
const GOAL = 100;
const HEART = 54; // half the width of a square's heart
const HEART_DY = -4; // hearts sit a little above the number badge's centre
const LADDER_ENDS = new Set(Object.values(LADDERS));
const SNAKE_ENDS = new Set(Object.values(SNAKES));

// Heart colours: gradient top, gradient bottom, outline, number-badge ring.
const KINDS = {
  rose: ['#f9b3c8', '#ee7c9e', '#c44d73', '#e08aa3'],
  cream: ['#ffffff', '#fff0e8', '#e39ab0', '#eab0c0'],
  up: ['#ffe68f', '#f4b72f', '#ad760c', '#d7a331'],
  upEnd: ['#fffbe9', '#ffe7a6', '#d1a137', '#ddb655'],
  down: ['#cdb8f7', '#987ad8', '#6143a6', '#9275cf'],
  downEnd: ['#fbf8ff', '#e3d6fa', '#a188d6', '#bca8e6'],
  goal: ['#ffa0bc', '#e8497b', '#a92b57', '#e1ab44'],
};

const r1 = (n) => Math.round(n * 10) / 10;

// A plump heart centred on (cx, cy): `s` is half its width, the tip points down.
export function heartPath(s, cx = 0, cy = 0) {
  const p = (x, y) => `${r1(cx + x * s)} ${r1(cy + y * s)}`;
  return (
    `M${p(0, 0.95)}` +
    `C${p(-0.18, 0.8)} ${p(-1, 0.32)} ${p(-1, -0.27)}` +
    `C${p(-1, -0.72)} ${p(-0.64, -0.98)} ${p(-0.31, -0.96)}` +
    `C${p(-0.13, -0.95)} ${p(-0.03, -0.84)} ${p(0, -0.67)}` +
    `C${p(0.03, -0.84)} ${p(0.13, -0.95)} ${p(0.31, -0.96)}` +
    `C${p(0.64, -0.98)} ${p(1, -0.72)} ${p(1, -0.27)}` +
    `C${p(1, 0.32)} ${p(0.18, 0.8)} ${p(0, 0.95)}Z`
  );
}

// Smooth curve (Catmull-Rom) through a list of points, as an SVG path.
export function routePath(points) {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const [c1, c2, p2] = span(points, i);
    d += ` C${r1(c1[0])} ${r1(c1[1])} ${r1(c2[0])} ${r1(c2[1])} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// Bezier control points of the curve between points[i] and points[i + 1].
function span(points, i) {
  const p0 = points[i - 1] ?? points[i];
  const p1 = points[i];
  const p2 = points[i + 1];
  const p3 = points[i + 2] ?? p2;
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
  const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return [c1, c2, p2];
}

// The same curve as routePath, as a dense list of points with their distance
// along the curve, so things can be spaced evenly along it.
function measure(points, perSpan = 12) {
  const pts = [points[0]];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const [c1, c2, p2] = span(points, i);
    for (let k = 1; k <= perSpan; k++) {
      const t = k / perSpan;
      const u = 1 - t;
      pts.push([0, 1].map((d) => u * u * u * p1[d] + 3 * u * u * t * c1[d] + 3 * u * t * t * c2[d] + t * t * t * p2[d]));
    }
  }
  const dist = [0];
  for (let i = 1; i < pts.length; i++) dist.push(dist[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
  return { pts, dist, length: dist.at(-1) };
}

// The point `at` px along a measured curve, with its heading in degrees.
function pointAt({ pts, dist }, at) {
  let j = 1;
  while (j < dist.length - 1 && dist[j] < at) j++;
  const a = pts[j - 1];
  const b = pts[j];
  const f = Math.min(1, Math.max(0, (at - dist[j - 1]) / (dist[j] - dist[j - 1] || 1)));
  return { x: a[0] + (b[0] - a[0]) * f, y: a[1] + (b[1] - a[1]) * f, angle: (Math.atan2(b[1] - a[1], b[0] - a[0]) * 180) / Math.PI };
}

// Evenly spaced points about `gap` px apart, leaving `margin` px free at each
// end (those parts are hidden under the hearts), and none within `skip` px of
// the middle, where the arrow goes.
function spacedAlong(curve, gap, margin, skip = 0) {
  const usable = curve.length - 2 * margin;
  if (usable <= 0) return [];
  const count = Math.max(1, Math.round(usable / gap));
  const step = usable / count;
  const out = [];
  for (let i = 0; i < count; i++) {
    const at = margin + step * (i + 0.5);
    if (Math.abs(at - curve.length / 2) >= skip) out.push(pointAt(curve, at));
  }
  return out;
}

// Small deterministic random numbers, so the meadow looks the same every time.
function seeded(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Which square sits in a given row (1 at the bottom) and column (1 on the left).
function squareAt(row, col) {
  return row % 2 ? (row - 1) * 10 + col : row * 10 + 1 - col;
}

function rowY(row) {
  let sum = 0;
  for (let n = row * 10 - 9; n <= row * 10; n++) sum += CELL_CENTERS[n][1];
  return sum / 10;
}

export function kindOf(n) {
  if (n === GOAL) return 'goal';
  if (LADDERS[n]) return 'up';
  if (SNAKES[n]) return 'down';
  if (LADDER_ENDS.has(n)) return 'upEnd';
  if (SNAKE_ENDS.has(n)) return 'downEnd';
  return n % 2 ? 'cream' : 'rose';
}

// ---------- pieces ----------

function defs() {
  const { x, y, w, h, r } = FIELD;
  const gradients = Object.entries(KINDS)
    .map(
      ([kind, [top, bottom]]) =>
        `<linearGradient id="a-hg-${kind}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${bottom}"/></linearGradient>`,
    )
    .join('');
  return (
    `<defs>${gradients}` +
    `<linearGradient id="a-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fcdccd"/><stop offset=".5" stop-color="#fdeddf"/><stop offset="1" stop-color="#e4f2d6"/></linearGradient>` +
    `<radialGradient id="a-sunGlow"><stop offset="0" stop-color="#fffbe4"/><stop offset=".45" stop-color="#fff0c4" stop-opacity=".7"/><stop offset="1" stop-color="#ffe6a8" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="a-goalGlow"><stop offset="0" stop-color="#fffbe8"/><stop offset=".45" stop-color="#ffe9a6" stop-opacity=".75"/><stop offset="1" stop-color="#f7c95a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="a-haloUp"><stop offset=".5" stop-color="#fff3b8" stop-opacity=".95"/><stop offset="1" stop-color="#ffe27a" stop-opacity="0"/></radialGradient>` +
    `<radialGradient id="a-haloUpEnd"><stop offset=".5" stop-color="#fff6cc" stop-opacity=".75"/><stop offset="1" stop-color="#ffe9a0" stop-opacity="0"/></radialGradient>` +
    `<clipPath id="a-fieldClip"><rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}"/></clipPath>` +
    `<path id="a-sqHeart" d="${heartPath(HEART, 0, HEART_DY)}" stroke-width="4" stroke-linejoin="round"/>` +
    `<path id="a-sqShadow" d="${heartPath(HEART + 1, 0, HEART_DY + 6)}" fill="#163b26" fill-opacity=".24"/>` +
    `<ellipse id="a-sqShine" cx="-25" cy="-31" rx="14" ry="8" transform="rotate(-38 -25 -31)" fill="#fff" fill-opacity=".55"/>` +
    `</defs>`
  );
}

// Cream paper with the double gold rule of the frame; the rule carries on
// below the picture, round the control panel and into the frame's foot.
function paper() {
  const outer = `M10 ${H + 5}V22A12 12 0 0 1 22 10H1375A12 12 0 0 1 1387 22V${H + 5}`;
  const inner = `M15.5 ${H + 5}V23.5A8 8 0 0 1 23.5 15.5H1373.5A8 8 0 0 1 1381.5 23.5V${H + 5}`;
  return (
    `<rect width="${W}" height="${H}" fill="#f3efe3"/>` +
    `<path d="${outer}" fill="none" stroke="#f6e5c2" stroke-width="4.5"/>` +
    `<path d="${outer}" fill="none" stroke="#bca573" stroke-width="2"/>` +
    `<path d="${inner}" fill="none" stroke="#cfc3ab" stroke-width="1"/>`
  );
}

function cloud(x, y, scale = 1, opacity = 1) {
  return (
    `<g transform="translate(${x} ${y}) scale(${scale})" opacity="${opacity}">` +
    `<ellipse cx="2" cy="14" rx="60" ry="12" fill="#e6dcc6" fill-opacity=".55"/>` +
    `<g fill="#fffdf8"><ellipse cx="0" cy="6" rx="62" ry="16"/><circle cx="-27" cy="-1" r="19"/><circle cx="3" cy="-11" r="25"/><circle cx="31" cy="1" r="17"/></g>` +
    `</g>`
  );
}

function floatingHeart(x, y, s, tilt, kind, shine = true) {
  const [, , edge] = KINDS[kind];
  const gloss = shine
    ? `<ellipse cx="${r1(-0.46 * s)}" cy="${r1(-0.55 * s)}" rx="${r1(0.27 * s)}" ry="${r1(0.16 * s)}" transform="rotate(-38 ${r1(-0.46 * s)} ${r1(-0.55 * s)})" fill="#fff" fill-opacity=".55"/>`
    : '';
  return (
    `<g transform="translate(${x} ${y}) rotate(${tilt})">` +
    `<path d="${heartPath(s)}" fill="url(#a-hg-${kind})" stroke="${edge}" stroke-width="${r1(Math.max(1.6, s * 0.075))}" stroke-linejoin="round"/>` +
    `${gloss}</g>`
  );
}

function sparkle(x, y, s, fill = '#fffbe6', stroke = '#e2b43c') {
  const k = s * 0.22;
  return `<path d="M${x} ${y - s}Q${r1(x + k)} ${r1(y - k)} ${x + s} ${y}Q${r1(x + k)} ${r1(y + k)} ${x} ${y + s}Q${r1(x - k)} ${r1(y + k)} ${x - s} ${y}Q${r1(x - k)} ${r1(y - k)} ${x} ${y - s}Z" fill="${fill}" stroke="${stroke}" stroke-width="1.6" stroke-linejoin="round"/>`;
}

// Title, subtitle and legend. The words are filled in (and the hearts next to
// them lined up) by setBoardText once the language is known.
function header() {
  return (
    cloud(108, 80) +
    cloud(1288, 80) +
    `<g id="a-titleHeartL">${floatingHeart(8, 6, 25, -12, 'rose')}${floatingHeart(-24, -22, 11, -24, 'up', false)}</g>` +
    `<g id="a-titleHeartR">${floatingHeart(-8, 6, 25, 12, 'rose')}${floatingHeart(24, -22, 11, 24, 'up', false)}</g>` +
    `<text id="a-title" class="art-title" x="${MID}" y="104"></text>` +
    `<text id="a-subtitle" class="art-subtitle" x="${MID}" y="147"></text>` +
    `<g id="a-legendUpIcon">${floatingHeart(0, 0, 12, 0, 'up', false)}</g>` +
    `<text id="a-legendUp" class="art-legend up" x="${MID}" y="186"></text>` +
    `<g id="a-legendDownIcon">${floatingHeart(0, 0, 12, 0, 'down', false)}</g>` +
    `<text id="a-legendDown" class="art-legend down" x="${MID}" y="186"></text>`
  );
}

// Rolling hills, one per row, lighter towards the top like a far-off view.
function hills() {
  const random = seeded(7);
  const far = [190, 227, 178];
  const near = [79, 146, 100];
  const left = FIELD.x - 20;
  const right = FIELD.x + FIELD.w + 20;
  let out = '';
  for (let row = 10; row >= 1; row--) {
    const t = ((10 - row) / 9) ** 0.9;
    const shade = row % 2 ? 1 : 1.035;
    const color = far.map((c, i) => Math.min(255, Math.round((c + (near[i] - c) * t) * shade)));
    const crest = rowY(row) - 72;
    const phase1 = random() * Math.PI * 2;
    const phase2 = random() * Math.PI * 2;
    const points = [];
    for (let x = left; x <= right; x += 44) {
      points.push([r1(x), r1(crest + Math.sin(x / 105 + phase1) * 8 + Math.sin(x / 41 + phase2) * 3.5)]);
    }
    const edge = routePath(points);
    out +=
      `<path d="${edge} L${right} ${H + 20} L${left} ${H + 20}Z" fill="rgb(${color.join(' ')})"/>` +
      `<path d="${edge}" fill="none" stroke="#f1fbe8" stroke-opacity=".14" stroke-width="3"/>`;
  }
  return out;
}

function daisy(x, y, petal, core, scale) {
  const petals = [0, 72, 144, 216, 288].map((a) => `<ellipse cy="-5.6" rx="3.4" ry="5.4" transform="rotate(${a})"/>`).join('');
  return `<g transform="translate(${r1(x)} ${r1(y)}) scale(${r1(scale)})"><g fill="${petal}">${petals}</g><circle r="3.3" fill="${core}"/></g>`;
}

function tuft(x, y, scale) {
  return `<path transform="translate(${r1(x)} ${r1(y)}) scale(${r1(scale)})" d="M0 0Q-2 -9 -8 -15M0 0Q0 -11 1.5 -19M0 0Q3 -8 9 -13" fill="none" stroke="#3b7d4f" stroke-opacity=".75" stroke-width="2.6" stroke-linecap="round"/>`;
}

function butterfly(x, y, wing, tilt) {
  const w = (cx, cy, rx, ry, a) =>
    `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" transform="rotate(${a} ${cx} ${cy})" fill="${wing}" stroke="#fff" stroke-width="1.3"/>`;
  return (
    `<g transform="translate(${r1(x)} ${r1(y)}) rotate(${r1(tilt)})">` +
    w(-6.5, -4, 6.5, 8, -25) +
    w(6.5, -4, 6.5, 8, 25) +
    w(-4.5, 5.5, 4.2, 4.8, 0) +
    w(4.5, 5.5, 4.2, 4.8, 0) +
    `<rect x="-1.4" y="-8.5" width="2.8" height="17" rx="1.4" fill="#5b3a2e"/></g>`
  );
}

// Flowers, grass, little hearts and butterflies in the corners between the
// squares, kept clear of the golden and purple paths.
function meadow() {
  const random = seeded(2026);
  const routePoints = Object.values(ROUTES).flatMap((points) => measure(points, 8).pts);
  const clearOfPaths = (x, y) => routePoints.every(([px, py]) => Math.hypot(px - x, py - y) > 30);
  let out = '';
  let butterflies = 0;
  for (let row = 1; row < 10; row++) {
    for (let col = 1; col < 10; col++) {
      const around = [squareAt(row, col), squareAt(row, col + 1), squareAt(row + 1, col), squareAt(row + 1, col + 1)];
      const x = around.reduce((sum, n) => sum + CELL_CENTERS[n][0], 0) / 4 + (random() - 0.5) * 10;
      const y = around.reduce((sum, n) => sum + CELL_CENTERS[n][1], 0) / 4 + (random() - 0.5) * 8;
      const pick = random();
      if (!clearOfPaths(x, y)) continue;
      if (pick < 0.3) out += daisy(x, y, '#fffdf6', '#f6c343', 0.95 + random() * 0.3);
      else if (pick < 0.44) out += daisy(x, y, '#ffd0e0', '#f59a3c', 0.85 + random() * 0.3);
      else if (pick < 0.64) out += tuft(x, y + 8, 0.9 + random() * 0.4);
      else if (pick < 0.78) out += `<path d="${heartPath(7 + random() * 2, x, y)}" fill="#ffd6e4" fill-opacity=".95"/>`;
      else if (pick < 0.86 && butterflies < 4) {
        out += butterfly(x, y, butterflies % 2 ? '#ffcf5c' : '#ff9ec2', (random() - 0.5) * 50);
        butterflies++;
      }
    }
  }
  // grass along the bottom edge, between the first row's hearts
  for (let col = 1; col < 10; col++) {
    const a = CELL_CENTERS[squareAt(1, col)];
    const b = CELL_CENTERS[squareAt(1, col + 1)];
    out += tuft((a[0] + b[0]) / 2 + (random() - 0.5) * 16, 1719, 0.8 + random() * 0.3);
  }
  return out;
}

// The trail every token follows, from 1 along each row and up at the ends.
function trail() {
  const d = routePath(CELL_CENTERS.slice(1));
  return (
    `<path d="${d}" fill="none" stroke="#fbf3dc" stroke-opacity=".24" stroke-width="40" stroke-linecap="round" stroke-linejoin="round"/>` +
    `<path d="${d}" fill="none" stroke="#fffbef" stroke-opacity=".9" stroke-width="7" stroke-linecap="round" stroke-dasharray="0.1 21"/>`
  );
}

function sky() {
  const { x, y, w } = FIELD;
  return (
    `<rect x="${x}" y="${y}" width="${w}" height="420" fill="url(#a-sky)"/>` +
    `<circle cx="140" cy="330" r="340" fill="url(#a-sunGlow)"/>` +
    cloud(560, 268, 0.7, 0.85) +
    cloud(905, 236, 0.5, 0.8) +
    cloud(1215, 290, 0.62, 0.85)
  );
}

// Warm light and sunbeams behind the goal.
function goalGlow() {
  const [cx, cy] = CELL_CENTERS[GOAL];
  const p = (angle, r) => `${r1(cx + Math.cos(angle) * r)} ${r1(cy + Math.sin(angle) * r)}`;
  let rays = '';
  for (let i = 0; i < 16; i++) {
    const a = (i * Math.PI) / 8 + Math.PI / 16;
    const len = i % 2 ? 128 : 172;
    rays += `M${p(a - 0.12, 44)}L${p(a, len)}L${p(a + 0.12, 44)}Z`;
  }
  return `<circle cx="${cx}" cy="${cy}" r="200" fill="url(#a-goalGlow)"/><path d="${rays}" fill="#ffeaa8" fill-opacity=".85"/>`;
}

function field() {
  const { x, y, w, h, r } = FIELD;
  return (
    `<rect x="${x}" y="${y + 4}" width="${w}" height="${h}" rx="${r}" fill="#2d4a33" fill-opacity=".12"/>` +
    `<g clip-path="url(#a-fieldClip)">${sky()}${hills()}${meadow()}${trail()}${goalGlow()}</g>` +
    `<rect x="${x + 1}" y="${y + 1}" width="${w - 2}" height="${h - 2}" rx="${r - 1}" fill="none" stroke="#fff" stroke-opacity=".3" stroke-width="2"/>`
  );
}

// A golden path (climb up) or a purple path (slide down), with a little arrow
// halfway along pointing the way the token travels.
function path(points, up) {
  const d = routePath(points);
  const curve = measure(points);
  const marks = up
    ? spacedAlong(curve, 64, 62, 26).map((p) => `<path d="${heartPath(8.5, p.x, p.y)}" fill="#fff5c9" stroke="#cf9415" stroke-width="1.6"/>`)
    : spacedAlong(curve, 34, 58, 16).map((p) => `<circle cx="${r1(p.x)}" cy="${r1(p.y)}" r="3.2" fill="#f4efff"/>`);
  const mid = pointAt(curve, curve.length / 2);
  const arrow =
    `<path transform="translate(${r1(mid.x)} ${r1(mid.y)}) rotate(${r1(mid.angle)})" d="M-8 -10L10 0L-8 10L-3.5 0Z" ` +
    `fill="${up ? '#e3a414' : '#6547b5'}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/>`;
  return (
    `<g class="a-path ${up ? 'up' : 'down'}">` +
    `<path d="${d}" fill="none" stroke="${up ? '#fff0a0' : '#c9b6f6'}" stroke-opacity="${up ? 0.65 : 0.5}" stroke-width="${up ? 24 : 19}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${up ? '#f0b52c' : '#7a5cc4'}" stroke-width="${up ? 8 : 6.5}" stroke-linecap="round"/>` +
    `<path d="${d}" fill="none" stroke="${up ? '#fff8d6' : '#ece4ff'}" stroke-width="2.4" stroke-linecap="round"/>` +
    `${marks.join('')}${arrow}</g>`
  );
}

function paths() {
  let out = '';
  for (const [from, to] of Object.entries(LADDERS)) out += path(ROUTES[`${from}-${to}`], true);
  for (const [from, to] of Object.entries(SNAKES)) out += path(ROUTES[`${from}-${to}`], false);
  return out;
}

const BACKDROPS = {
  up: '<circle r="76" fill="url(#a-haloUp)"/>',
  upEnd: '<circle r="70" fill="url(#a-haloUpEnd)"/>',
  down: '<circle r="64" fill="none" stroke="#5a3d9c" stroke-opacity=".55" stroke-width="3.4" stroke-dasharray="0.1 9" stroke-linecap="round"/>',
  downEnd: '<circle r="62" fill="none" stroke="#6d55a8" stroke-opacity=".35" stroke-width="3" stroke-dasharray="0.1 9" stroke-linecap="round"/>',
};

const BADGES = {
  up:
    '<g transform="translate(41 -42)"><circle r="14" fill="#e2a21c" stroke="#fff" stroke-width="3"/>' +
    '<path d="M0 7V-6M-5.5 -0.5L0 -6L5.5 -0.5" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>',
  down: '<g transform="translate(41 -42)"><circle r="14" fill="#5a3d9c" stroke="#fff" stroke-width="3"/><text class="art-q" y="1">?</text></g>',
};

function square(n) {
  const [x, y] = CELL_CENTERS[n];
  const kind = kindOf(n);
  if (kind === 'goal') return goalSquare(x, y);
  const [, , edge, ring] = KINDS[kind];
  return (
    `<g class="a-sq" data-square="${n}" transform="translate(${x} ${y})">${BACKDROPS[kind] ?? ''}` +
    `<use href="#a-sqShadow"/><use href="#a-sqHeart" fill="url(#a-hg-${kind})" stroke="${edge}"/><use href="#a-sqShine"/>` +
    `<circle r="24.5" fill="#fffaf4" stroke="${ring}" stroke-width="2.5"/><text class="art-num" y="1">${n}</text>` +
    `${BADGES[kind] ?? ''}</g>`
  );
}

function goalSquare(x, y) {
  const [, , edge, ring] = KINDS.goal;
  const s = 62;
  return (
    `<g class="a-sq a-goal" data-square="${GOAL}" transform="translate(${x} ${y})">` +
    `<path d="${heartPath(s + 1, 0, 5)}" fill="#6b1d3a" fill-opacity=".25"/>` +
    `<path d="${heartPath(s, 0, -2)}" fill="url(#a-hg-goal)" stroke="${edge}" stroke-width="4.5" stroke-linejoin="round"/>` +
    `<ellipse cx="-28" cy="-35" rx="16" ry="9.5" transform="rotate(-38 -28 -35)" fill="#fff" fill-opacity=".55"/>` +
    `<circle r="31" fill="#fffaf0" stroke="${ring}" stroke-width="3.5"/><text class="art-num goal" y="1.5">${GOAL}</text></g>`
  );
}

// A bunch of hearts floating up over the goal, and its name on a ribbon.
function goalHearts() {
  return (
    `<g class="a-bunch">` +
    floatingHeart(318, 222, 6, 16, 'rose', false) +
    floatingHeart(276, 252, 8, 10, 'upEnd', false) +
    floatingHeart(226, 300, 12, 18, 'upEnd') +
    floatingHeart(82, 222, 9, -12, 'rose', false) +
    floatingHeart(140, 219, 10, 10, 'downEnd', false) +
    floatingHeart(60, 256, 17, -16, 'up') +
    floatingHeart(178, 252, 22, 14, 'rose') +
    floatingHeart(112, 288, 40, 0, 'goal') +
    sparkle(50, 312, 9) +
    sparkle(206, 216, 7) +
    sparkle(250, 270, 6) +
    sparkle(352, 250, 5) +
    `</g>` +
    `<rect id="a-goalBox" x="44" y="345" width="160" height="34" rx="17" fill="#fffaf0" stroke="#d8ab4a" stroke-width="2.5"/>` +
    `<text id="a-goal" class="art-pill" x="124" y="363"></text>`
  );
}

function startLabel() {
  return (
    `<rect id="a-startBox" x="66" y="1686" width="60" height="28" rx="14" fill="#fffaf0" stroke="#d8ab4a" stroke-width="2"/>` +
    `<text id="a-start" class="art-pill start" x="96.4" y="1701"></text>`
  );
}

// The whole picture, to go inside <svg viewBox="0 0 1396 1755">.
export function boardMarkup() {
  let squares = '';
  for (let n = 1; n <= GOAL; n++) squares += square(n);
  return defs() + paper() + header() + field() + paths() + squares + goalHearts() + startLabel();
}

// ---------- words (browser only) ----------

// Fills in the board's words: { title, subtitle, legendUp, legendDown, goal, start }.
export function setBoardText(svg, text) {
  const ids = { title: 'a-title', subtitle: 'a-subtitle', legendUp: 'a-legendUp', legendDown: 'a-legendDown', goal: 'a-goal', start: 'a-start' };
  for (const [key, id] of Object.entries(ids)) svg.querySelector(`#${id}`).textContent = text[key] ?? '';
  layoutBoardText(svg);
}

// Lines things up around the words once they are measured: the hearts either
// side of the title, the legend centred as one line, and the labels in pills
// that fit them. Call again when web fonts finish loading.
export function layoutBoardText(svg) {
  const $ = (id) => svg.querySelector(`#${id}`);
  const width = (id) => {
    try {
      return $(id).getComputedTextLength();
    } catch {
      return 0; // not rendered yet
    }
  };
  const move = (id, x, y) => $(id).setAttribute('transform', `translate(${r1(x)} ${r1(y)})`);

  const title = width('a-title');
  move('a-titleHeartL', MID - title / 2 - 56, 74);
  move('a-titleHeartR', MID + title / 2 + 56, 74);

  const ICON = 24;
  const PAD = 9;
  const GAP = 46;
  const up = width('a-legendUp');
  const down = width('a-legendDown');
  let x = MID - (ICON + PAD + up + GAP + ICON + PAD + down) / 2;
  move('a-legendUpIcon', x + ICON / 2, 186);
  $('a-legendUp').setAttribute('x', r1(x + ICON + PAD));
  x += ICON + PAD + up + GAP;
  move('a-legendDownIcon', x + ICON / 2, 186);
  $('a-legendDown').setAttribute('x', r1(x + ICON + PAD));

  const pill = (textId, boxId, centre, pad) => {
    const w = width(textId) + pad;
    const left = Math.max(FIELD.x + 7, centre - w / 2);
    $(boxId).setAttribute('x', r1(left));
    $(boxId).setAttribute('width', r1(w));
    $(textId).setAttribute('x', r1(left + w / 2));
  };
  pill('a-goal', 'a-goalBox', CELL_CENTERS[GOAL][0], 36);
  pill('a-start', 'a-startBox', CELL_CENTERS[1][0], 28);
}
