// Tests for Journey to Gratitude (the game in gratitude/).

import assert from 'node:assert/strict';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { test } from 'node:test';

import { BOARD_SIZE, CELL_CENTERS, LADDERS, ROUTES, SNAKES } from '../gratitude/js/board-data.js';
import { boardMarkup, heartPath, kindOf, routePath } from '../gratitude/js/board-art.js';
import {
  FINAL_SQUARE,
  FINISH_RULES,
  START_SQUARE,
  createGame,
  isValidState,
  needsQuestion,
  planMove,
  rollDie,
  takeTurn,
} from '../gratitude/js/game.js';
import { QUESTIONS, QUESTION_BY_ID, shuffled } from '../gratitude/js/questions.js';
import { LANGS, STRING_TABLES } from '../gratitude/js/i18n.js';

const GAME_DIR = new URL('../gratitude/', import.meta.url).pathname;

const twoPlayers = () => [
  { name: 'A', color: 'pink', bot: false },
  { name: 'B', color: 'gold', bot: true },
];

const seededRandom = (seed) => () => {
  seed = (seed * 16807) % 2147483647;
  return (seed - 1) / 2147483646;
};

// ---------- the board ----------

test('8 golden hearts lead up and 8 purple hearts lead down, and moves never chain', () => {
  assert.deepEqual(LADDERS, { 3: 22, 8: 30, 20: 41, 36: 57, 51: 67, 62: 84, 71: 91, 78: 98 });
  assert.deepEqual(SNAKES, { 16: 6, 28: 9, 45: 25, 54: 34, 64: 47, 74: 53, 89: 68, 95: 75 });
  for (const [from, to] of Object.entries(LADDERS)) assert.ok(to > from, `golden heart ${from} goes up`);
  for (const [from, to] of Object.entries(SNAKES)) assert.ok(to < from, `purple heart ${from} goes down`);
  const starts = [...Object.keys(LADDERS), ...Object.keys(SNAKES)].map(Number);
  const ends = [...Object.values(LADDERS), ...Object.values(SNAKES)];
  assert.equal(new Set(starts).size, starts.length);
  for (const end of ends) assert.ok(!starts.includes(end), `square ${end} does not chain`);
});

test('every square has a centre on the board, laid out boustrophedon', () => {
  assert.equal(CELL_CENTERS.length, 101);
  for (let n = 1; n <= 100; n++) {
    const [x, y] = CELL_CENTERS[n];
    assert.ok(x > 0 && x < BOARD_SIZE.width && y > 0 && y < BOARD_SIZE.height, `square ${n} inside the board`);
  }
  assert.ok(CELL_CENTERS[2][0] > CELL_CENTERS[1][0]);
  assert.ok(CELL_CENTERS[12][0] < CELL_CENTERS[11][0]);
  for (let row = 1; row < 10; row++) {
    assert.ok(CELL_CENTERS[row * 10 + 1][1] < CELL_CENTERS[row * 10][1] - 80, `row ${row + 1} is above row ${row}`);
  }
});

test('every golden and purple path runs from its start square to its end square', () => {
  const pairs = [...Object.entries(LADDERS), ...Object.entries(SNAKES)];
  assert.equal(Object.keys(ROUTES).length, pairs.length);
  for (const [from, to] of pairs) {
    const route = ROUTES[`${from}-${to}`];
    assert.ok(route && route.length >= 3, `route ${from}-${to} exists`);
    assert.deepEqual(route[0], CELL_CENTERS[from]);
    assert.deepEqual(route.at(-1), CELL_CENTERS[to]);
  }
});

test('the board picture has a numbered heart on every square', () => {
  const markup = boardMarkup();
  for (let n = 1; n <= 100; n++) {
    const found = markup.match(new RegExp(`<g class="a-sq[^"]*" data-square="${n}"[^>]*>(.*?)</g>(?=<g class="a-sq|<rect id="a-goalBox")`));
    assert.ok(found, `square ${n} is drawn`);
    assert.match(found[1], new RegExp(`>${n}</text>`), `square ${n} shows its number`);
  }
  assert.equal((markup.match(/data-square="/g) ?? []).length, 100, 'no square is drawn twice');
});

test('golden, purple and goal hearts are told apart on the board', () => {
  const markup = boardMarkup();
  const squareMarkup = (n) => markup.split(`data-square="${n}"`)[1].split('data-square=')[0];
  for (const n of Object.keys(LADDERS).map(Number)) {
    assert.equal(kindOf(n), 'up');
    assert.match(squareMarkup(n), /url\(#a-hg-up\)/, `square ${n} is a golden heart`);
  }
  for (const n of Object.keys(SNAKES).map(Number)) {
    assert.equal(kindOf(n), 'down');
    assert.match(squareMarkup(n), /url\(#a-hg-down\)/, `square ${n} is a purple heart`);
    assert.match(squareMarkup(n), />\?<\/text>/, `square ${n} shows a question mark`);
  }
  for (const n of Object.values(LADDERS)) assert.equal(kindOf(n), n === 100 ? 'goal' : 'upEnd');
  for (const n of Object.values(SNAKES)) assert.equal(kindOf(n), 'downEnd');
  assert.equal(kindOf(100), 'goal');
  assert.equal(kindOf(1), 'cream');
  assert.equal(kindOf(2), 'rose');
  assert.equal((markup.match(/class="a-path up"/g) ?? []).length, Object.keys(LADDERS).length);
  assert.equal((markup.match(/class="a-path down"/g) ?? []).length, Object.keys(SNAKES).length);
  for (const id of ['a-title', 'a-subtitle', 'a-legendUp', 'a-legendDown', 'a-goal', 'a-start']) {
    assert.ok(markup.includes(`id="${id}"`), `the board has a place for ${id}`);
  }
});

test('heart and curve paths are well formed', () => {
  const heart = heartPath(10, 5, 5);
  assert.match(heart, /^M[\d. -]+(C[\d. -]+)+Z$/);
  assert.ok(heart.startsWith('M5 14.5'), 'the tip points down, below the centre');
  const curve = routePath([[0, 0], [10, 10], [20, 0]]);
  assert.match(curve, /^M0 0( C[\d. -]+){2}$/);
});

// ---------- the rules ----------

test('a plain roll moves forward by the pips', () => {
  const move = planMove(1, 4);
  assert.deepEqual(move.steps, [2, 3, 4, 5]);
  assert.equal(move.to, 5);
  assert.equal(move.jump, null);
  assert.equal(move.won, false);
});

test('landing on a golden heart climbs, landing on a purple heart slides', () => {
  const up = planMove(1, 2);
  assert.equal(up.landed, 3);
  assert.deepEqual(up.jump, { type: 'ladder', from: 3, to: 22 });
  assert.equal(up.to, 22);

  const down = planMove(12, 4);
  assert.equal(down.landed, 16);
  assert.deepEqual(down.jump, { type: 'snake', from: 16, to: 6 });
  assert.equal(down.to, 6);

  // passing over a purple heart without stopping is safe
  assert.equal(planMove(14, 3).to, 17);
});

test('exact rule: overshooting 100 leaves the token where it is', () => {
  const move = planMove(97, 5, FINISH_RULES.EXACT);
  assert.equal(move.blocked, true);
  assert.deepEqual(move.steps, []);
  assert.equal(move.to, 97);
  assert.equal(planMove(97, 3, FINISH_RULES.EXACT).won, true);
});

test('bounce rule: extra pips walk back from 100', () => {
  const move = planMove(97, 5, FINISH_RULES.BOUNCE);
  assert.deepEqual(move.steps, [98, 99, 100, 99, 98]);
  assert.equal(move.bounced, true);
  assert.equal(move.to, 98);
  assert.equal(move.won, false);
  const unlucky = planMove(99, 6, FINISH_RULES.BOUNCE);
  assert.equal(unlucky.landed, 95);
  assert.equal(unlucky.to, 75);
});

test('turns rotate between players and positions update', () => {
  let state = createGame({ players: twoPlayers() });
  assert.equal(state.players[0].pos, START_SQUARE);
  ({ state } = takeTurn(state, 2)); // A: 1 -> 3 -> 22
  assert.equal(state.players[0].pos, 22);
  assert.equal(state.current, 1);
  ({ state } = takeTurn(state, 6)); // B: 1 -> 7
  assert.equal(state.players[1].pos, 7);
  assert.equal(state.current, 0);
  assert.equal(state.history.length, 2);
  assert.equal(state.players[0].rolls, 1);
});

test('takeTurn does not change the previous state', () => {
  const before = createGame({ players: twoPlayers() });
  const snapshot = structuredClone(before);
  takeTurn(before, 5);
  assert.deepEqual(before, snapshot);
});

test('reaching 100 wins and ends the game', () => {
  let state = createGame({ players: twoPlayers() });
  state = { ...state, players: state.players.map((p, i) => (i === 0 ? { ...p, pos: 96 } : p)) };
  const { state: done, move } = takeTurn(state, 4);
  assert.equal(move.won, true);
  assert.equal(done.winner, 0);
  assert.equal(done.players[0].pos, FINAL_SQUARE);
  assert.throws(() => takeTurn(done, 1), /over/);
});

test('invalid input is rejected', () => {
  assert.throws(() => createGame({ players: twoPlayers().slice(0, 1) }), RangeError);
  assert.throws(() => createGame({ players: twoPlayers(), finishRule: 'nope' }), RangeError);
  const state = createGame({ players: twoPlayers() });
  assert.throws(() => takeTurn(state, 0), RangeError);
  assert.throws(() => takeTurn(state, 7), RangeError);
  assert.throws(() => takeTurn(state, 2.5), RangeError);
});

test('rollDie covers 1 to 6', () => {
  assert.equal(rollDie(() => 0), 1);
  assert.equal(rollDie(() => 0.999999), 6);
  const seen = new Set();
  for (let i = 0; i < 600; i++) seen.add(rollDie());
  assert.deepEqual([...seen].sort(), [1, 2, 3, 4, 5, 6]);
});

test('saved games are checked before they are resumed', () => {
  const state = createGame({ players: twoPlayers() });
  assert.equal(isValidState(state), true);
  assert.equal(isValidState(null), false);
  assert.equal(isValidState({ ...state, current: 5 }), false);
  assert.equal(isValidState({ ...state, players: state.players.map((p) => ({ ...p, pos: 101 })) }), false);
  assert.equal(isValidState({ ...state, finishRule: 'x' }), false);
  const { questions, ...withoutSetting } = state;
  assert.equal(typeof questions, 'boolean');
  assert.equal(isValidState(withoutSetting), false);
  const played = takeTurn(state, 3).state;
  assert.equal(isValidState(played), true);
  assert.equal(isValidState({ ...played, history: [{ player: 9, roll: 3, from: 1, landed: 4, to: 4 }] }), false);
});

test('whole games always finish, under both finishing rules, with or without questions', () => {
  const random = seededRandom(7);
  for (const finishRule of Object.values(FINISH_RULES)) {
    for (const questions of [false, true]) {
      for (let g = 0; g < 150; g++) {
        let state = createGame({ players: twoPlayers(), finishRule, questions });
        let turns = 0;
        while (state.winner === null) {
          const roll = rollDie(random);
          const answer = needsQuestion(state, roll) ? random() < 0.7 : null;
          ({ state } = takeTurn(state, roll, answer));
          assert.ok(++turns < 5000, 'game terminates');
        }
        assert.equal(state.players[state.winner].pos, FINAL_SQUARE);
        assert.equal(isValidState(state), true);
      }
    }
  }
});

// ---------- heart questions on purple hearts ----------

const withQuestions = (positions) => {
  const state = createGame({ players: twoPlayers(), questions: true });
  return { ...state, players: state.players.map((p, i) => ({ ...p, pos: positions[i] ?? p.pos })) };
};

test('a question is only needed when the roll stops on a purple heart', () => {
  const state = withQuestions([12, 1]);
  assert.equal(needsQuestion(state, 4), true); // 12 + 4 = 16, purple heart
  assert.equal(needsQuestion(state, 3), false); // 15, plain heart
  assert.equal(needsQuestion(withQuestions([1, 1]), 2), false); // 3 is golden
  assert.equal(needsQuestion({ ...state, questions: false }, 4), false);
});

test('a right answer keeps the token on the purple heart', () => {
  const { state, move } = takeTurn(withQuestions([12, 1]), 4, true);
  assert.equal(move.landed, 16);
  assert.equal(move.answer, true);
  assert.equal(move.spared, true);
  assert.equal(move.jump, null);
  assert.equal(state.players[0].pos, 16);
  assert.equal(state.current, 1);
});

test('a wrong answer slides the token down the purple path', () => {
  const { state, move } = takeTurn(withQuestions([12, 1]), 4, false);
  assert.equal(move.answer, false);
  assert.equal(move.spared, false);
  assert.deepEqual(move.jump, { type: 'snake', from: 16, to: 6 });
  assert.equal(state.players[0].pos, 6);
});

test('the answer is required on a purple heart and ignored elsewhere', () => {
  assert.throws(() => takeTurn(withQuestions([12, 1]), 4), TypeError);
  const plain = takeTurn(withQuestions([12, 1]), 3, true).move;
  assert.equal(plain.answer, null);
  assert.equal(plain.spared, false);
});

test('with questions switched off, purple hearts always slide', () => {
  const state = createGame({ players: twoPlayers() });
  assert.equal(state.questions, false);
  const staged = { ...state, players: state.players.map((p, i) => (i === 0 ? { ...p, pos: 12 } : p)) };
  const { move } = takeTurn(staged, 4, true);
  assert.equal(move.answer, null);
  assert.equal(move.to, 6);
});

test('bouncing back onto 95 also asks the question', () => {
  const state = { ...withQuestions([99, 1]), finishRule: FINISH_RULES.BOUNCE };
  assert.equal(needsQuestion(state, 6), true);
  assert.equal(takeTurn(state, 6, true).move.to, 95);
  assert.equal(takeTurn(state, 6, false).move.to, 75);
});

// ---------- the question bank ----------

test('every question is complete in English and Chinese', () => {
  assert.ok(QUESTIONS.length >= 50, 'plenty of questions to draw from');
  assert.equal(QUESTION_BY_ID.size, QUESTIONS.length, 'ids are unique');
  for (const q of QUESTIONS) {
    for (const lang of ['en', 'zh']) {
      const text = q[lang];
      assert.ok(text?.question?.trim(), `${q.id} ${lang} has a question`);
      assert.ok(text.why?.trim(), `${q.id} ${lang} explains the answer`);
      if (q.judge) {
        assert.equal(typeof q.answer, 'boolean', `${q.id} says whether the behaviour is right`);
        assert.equal(text.choices, undefined);
      } else {
        assert.ok(text.choices.length >= 2 && text.choices.length <= 3, `${q.id} ${lang} has 2-3 choices`);
        assert.ok(text.choices.every((c) => c.trim()), `${q.id} ${lang} choices are filled in`);
        assert.equal(new Set(text.choices).size, text.choices.length, `${q.id} ${lang} choices differ`);
      }
    }
    if (!q.judge) {
      assert.equal(q.zh.choices.length, q.en.choices.length, `${q.id} has the same choices in both languages`);
      assert.equal(q.emoji.length, q.zh.choices.length, `${q.id} has a picture for every choice`);
      assert.equal(new Set(q.emoji).size, q.emoji.length, `${q.id} uses a different picture for each choice`);
    }
  }
});

test('the bank is mostly about gratitude and mixes right and wrong statements', () => {
  const thankful = QUESTIONS.filter((q) => /thank|grateful|gratitude/i.test(`${q.en.question} ${q.en.choices?.join(' ') ?? ''} ${q.en.why}`));
  assert.ok(thankful.length >= QUESTIONS.length / 2, `${thankful.length} of ${QUESTIONS.length} questions mention thanks`);
  const judged = QUESTIONS.filter((q) => q.judge);
  assert.ok(judged.some((q) => q.answer === true));
  assert.ok(judged.some((q) => q.answer === false));
});

test('shuffled keeps every item exactly once', () => {
  const items = [1, 2, 3, 4, 5];
  const out = shuffled(items);
  assert.deepEqual([...out].sort(), items);
  assert.deepEqual(items, [1, 2, 3, 4, 5], 'input left untouched');
});

// ---------- no religion ----------

const RELIGIOUS = [
  /\bbuddh/i, /\bkarma/i, /\bmerit/i, /\benlighten/i, /\bnirvana/i, /pure land/i, /\blotus/i, /\btemple/i,
  /\bpray/i, /\bgods?\b/i, /\bheaven/i, /\bangel/i, /\bchurch/i, /\bbless/i, /\bholy\b/i, /\bsacred/i,
  /\bspirit/i, /\bsouls?\b/i, /\bzen\b/i, /\bmonks?\b/i, /\breincarnat/i, /\breborn\b/i, /\brebirth/i,
  /\bbible/i, /\bjesus/i, /\bchrist/i, /\ballah/i, /\bmosque/i, /\bsynagogue/i, /\bhindu/i, /\bmeditat/i,
  /佛/, /菩萨/, /菩提/, /因果/, /功德/, /极乐/, /往生/, /轮回/, /莲/, /寺/, /庙/, /祈祷/, /上帝/, /天堂/, /神仙/,
  /禅/, /阿弥陀/, /观音/, /天使/, /圣/, /🙏|🪷|📿|⛪|🕌|🛕|☸|🕉|✝|☪|✡|🛐|😇|⛩|🕍/u,
];

function religiousWords(text) {
  return RELIGIOUS.filter((pattern) => pattern.test(text)).map(String);
}

// Every string a player can see, with sample values filled into templates.
function allText(value) {
  if (typeof value === 'string') return [value];
  if (typeof value === 'function') return [true, false].flatMap((flag) => allText(value(flag ? 'Rosy' : true, 12, 34)));
  if (Array.isArray(value)) return value.flatMap(allText);
  if (value && typeof value === 'object') return Object.values(value).flatMap(allText);
  return [];
}

test('no religious words or symbols in anything a player sees', () => {
  for (const lang of LANGS) {
    for (const text of allText(STRING_TABLES[lang])) assert.deepEqual(religiousWords(text), [], `${lang}: ${text}`);
  }
  for (const q of QUESTIONS) {
    for (const text of allText([q.emoji ?? [], q.en, q.zh])) assert.deepEqual(religiousWords(text), [], `${q.id}: ${text}`);
  }
  assert.deepEqual(religiousWords(boardMarkup()), [], 'board picture');
});

test('no religious words or symbols anywhere in the game folder', () => {
  const files = [];
  const walk = (dir) => {
    for (const name of readdirSync(dir)) {
      const path = join(dir, name);
      if (statSync(path).isDirectory()) walk(path);
      else if (/\.(js|html|css|svg|md|json)$/.test(name)) files.push(path);
    }
  };
  walk(GAME_DIR);
  assert.ok(files.some((f) => f.endsWith('index.html')), 'the page is checked');
  for (const file of files) {
    assert.deepEqual(religiousWords(readFileSync(file, 'utf8')), [], file);
  }
});
