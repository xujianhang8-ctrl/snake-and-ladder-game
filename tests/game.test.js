import assert from 'node:assert/strict';
import { test } from 'node:test';

import { BOARD_SIZE, CELL_CENTERS, LADDERS, ROUTES, SNAKES } from '../js/board-data.js';
import {
  FINAL_SQUARE,
  FINISH_RULES,
  START_SQUARE,
  createGame,
  isValidState,
  planMove,
  rollDie,
  takeTurn,
} from '../js/game.js';

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
