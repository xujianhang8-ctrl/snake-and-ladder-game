import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BOARD_SIZE, CELL_CENTERS, LADDERS, ROUTES, SNAKES } from '../js/board-data.js';
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
} from '../js/game.js';
import { QUESTIONS, QUESTION_BY_ID, shuffled } from '../js/questions.js';

const twoPlayers = () => [
  { name: 'A', color: 'pink', bot: false },
  { name: 'B', color: 'gold', bot: true },
];

test('the board matches the artwork: 8 golden lotuses up, 8 purple lotuses down', () => {
  assert.deepEqual(LADDERS, { 3: 22, 8: 30, 20: 41, 36: 57, 51: 67, 62: 84, 71: 91, 78: 98 });
  assert.deepEqual(SNAKES, { 16: 6, 28: 9, 45: 25, 54: 34, 64: 47, 74: 53, 89: 68, 95: 75 });
  for (const [from, to] of Object.entries(LADDERS)) assert.ok(to > from, `ladder ${from} goes up`);
  for (const [from, to] of Object.entries(SNAKES)) assert.ok(to < from, `snake ${from} goes down`);
  // no square is both a start and an end, so moves never chain
  const starts = [...Object.keys(LADDERS), ...Object.keys(SNAKES)].map(Number);
  const ends = [...Object.values(LADDERS), ...Object.values(SNAKES)];
  assert.equal(new Set(starts).size, starts.length);
  for (const end of ends) assert.ok(!starts.includes(end), `square ${end} does not chain`);
});

test('every square has a centre inside the artwork, laid out boustrophedon', () => {
  assert.equal(CELL_CENTERS.length, 101);
  for (let n = 1; n <= 100; n++) {
    const [x, y] = CELL_CENTERS[n];
    assert.ok(x > 0 && x < BOARD_SIZE.width && y > 0 && y < BOARD_SIZE.height, `square ${n} inside the board`);
  }
  // row 1 runs left to right, row 2 right to left, and each row sits above the previous one
  assert.ok(CELL_CENTERS[2][0] > CELL_CENTERS[1][0]);
  assert.ok(CELL_CENTERS[12][0] < CELL_CENTERS[11][0]);
  for (let row = 1; row < 10; row++) {
    assert.ok(CELL_CENTERS[row * 10 + 1][1] < CELL_CENTERS[row * 10][1] - 80, `row ${row + 1} is above row ${row}`);
  }
});

test('every ladder and snake has a traced route from its start square to its end square', () => {
  const pairs = [...Object.entries(LADDERS), ...Object.entries(SNAKES)];
  assert.equal(Object.keys(ROUTES).length, pairs.length);
  for (const [from, to] of pairs) {
    const route = ROUTES[`${from}-${to}`];
    assert.ok(route && route.length >= 3, `route ${from}-${to} exists`);
    assert.deepEqual(route[0], CELL_CENTERS[from]);
    assert.deepEqual(route.at(-1), CELL_CENTERS[to]);
  }
});

test('a plain roll moves forward by the pips', () => {
  const move = planMove(1, 4);
  assert.deepEqual(move.steps, [2, 3, 4, 5]);
  assert.equal(move.to, 5);
  assert.equal(move.jump, null);
  assert.equal(move.won, false);
});

test('landing on a golden lotus climbs, landing on a purple lotus slides', () => {
  const up = planMove(1, 2);
  assert.equal(up.landed, 3);
  assert.deepEqual(up.jump, { type: 'ladder', from: 3, to: 22 });
  assert.equal(up.to, 22);

  const down = planMove(12, 4);
  assert.equal(down.landed, 16);
  assert.deepEqual(down.jump, { type: 'snake', from: 16, to: 6 });
  assert.equal(down.to, 6);

  // passing over a purple lotus without stopping is safe
  assert.equal(planMove(14, 3).to, 17);
});

test('the 78 golden lotus leads to 98 and the 95 purple lotus back to 75', () => {
  assert.equal(planMove(74, 4).to, 98);
  assert.equal(planMove(93, 2).to, 75);
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

  // bouncing onto the purple lotus at 95 still slides down
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

test('takeTurn does not mutate the previous state', () => {
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

test('saved states are validated before resuming', () => {
  const state = createGame({ players: twoPlayers() });
  assert.equal(isValidState(state), true);
  assert.equal(isValidState(null), false);
  assert.equal(isValidState({ ...state, current: 5 }), false);
  assert.equal(isValidState({ ...state, players: state.players.map((p) => ({ ...p, pos: 101 })) }), false);
  assert.equal(isValidState({ ...state, finishRule: 'x' }), false);
  const { karmaQuestions, ...older } = state;
  assert.equal(typeof karmaQuestions, 'boolean');
  assert.equal(isValidState(older), false);
  const played = takeTurn(state, 3).state;
  assert.equal(isValidState(played), true);
  assert.equal(isValidState({ ...played, history: [{ player: 9, roll: 3, from: 1, landed: 4, to: 4 }] }), false);
});

test('whole games always finish, under both finishing rules', () => {
  let seed = 7;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (const finishRule of Object.values(FINISH_RULES)) {
    for (let g = 0; g < 200; g++) {
      let state = createGame({ players: twoPlayers(), finishRule });
      let turns = 0;
      while (state.winner === null) {
        ({ state } = takeTurn(state, rollDie(random)));
        assert.ok(++turns < 5000, 'game terminates');
      }
      assert.equal(state.players[state.winner].pos, FINAL_SQUARE);
    }
  }
});

// ---------- karma questions on purple lotuses ----------

const withQuestions = (positions) => {
  const state = createGame({ players: twoPlayers(), karmaQuestions: true });
  return { ...state, players: state.players.map((p, i) => ({ ...p, pos: positions[i] ?? p.pos })) };
};

test('a question is only needed when the roll stops on a purple lotus', () => {
  const state = withQuestions([12, 1]);
  assert.equal(needsQuestion(state, 4), true); // 12 + 4 = 16, purple lotus
  assert.equal(needsQuestion(state, 3), false); // 15, plain lotus
  assert.equal(needsQuestion(withQuestions([1, 1]), 2), false); // 3 is golden
  assert.equal(needsQuestion({ ...state, karmaQuestions: false }, 4), false);
});

test('a right answer keeps the token on the purple lotus', () => {
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

test('the answer is required on a purple lotus and ignored elsewhere', () => {
  assert.throws(() => takeTurn(withQuestions([12, 1]), 4), TypeError);
  const plain = takeTurn(withQuestions([12, 1]), 3, true).move;
  assert.equal(plain.answer, null);
  assert.equal(plain.spared, false);
});

test('with questions switched off, purple lotuses always slide', () => {
  const state = createGame({ players: twoPlayers() });
  assert.equal(state.karmaQuestions, false);
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

test('games with questions always finish', () => {
  let seed = 11;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let g = 0; g < 200; g++) {
    let state = createGame({ players: twoPlayers(), karmaQuestions: true });
    let turns = 0;
    while (state.winner === null) {
      const roll = rollDie(random);
      const answer = needsQuestion(state, roll) ? random() < 0.7 : null;
      ({ state } = takeTurn(state, roll, answer));
      assert.ok(++turns < 5000, 'game terminates');
    }
    assert.equal(isValidState(state), true);
  }
});

// ---------- the question bank ----------

test('every question is complete in Chinese and English', () => {
  assert.ok(QUESTIONS.length >= 50, 'plenty of questions to draw from');
  assert.equal(QUESTION_BY_ID.size, QUESTIONS.length, 'ids are unique');
  for (const q of QUESTIONS) {
    for (const lang of ['zh', 'en']) {
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
    }
  }
});

test('the bank mixes right and wrong statements', () => {
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
