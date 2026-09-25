// Pure game rules for Snakes & Ladders on the lotus board.
// No DOM access here, so the rules can be unit-tested in Node.

import { LADDERS, SNAKES } from './board-data.js';

export const START_SQUARE = 1;
export const FINAL_SQUARE = 100;
export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

// What happens when a roll would carry a token past square 100.
export const FINISH_RULES = Object.freeze({
  EXACT: 'exact', // classic rule: the token does not move
  BOUNCE: 'bounce', // the token walks to 100 and back for the remaining pips
});

export function rollDie(random = Math.random) {
  return 1 + Math.floor(random() * 6);
}

// Where a token standing on `from` ends up after rolling `roll`.
// Returns every square walked through so the UI can animate the move.
// `answer` is the result of the karma question asked on a purple lotus:
// true keeps the token there, false (or null when no question is asked)
// sends it down the purple path.
export function planMove(from, roll, finishRule = FINISH_RULES.EXACT, answer = null) {
  const steps = [];
  let pos = from;
  let bounced = false;
  const blocked = from + roll > FINAL_SQUARE && finishRule !== FINISH_RULES.BOUNCE;

  if (!blocked) {
    let dir = 1;
    for (let i = 0; i < roll; i++) {
      if (pos === FINAL_SQUARE) {
        dir = -1;
        bounced = true;
      }
      pos += dir;
      steps.push(pos);
    }
  }

  const landed = pos;
  let jump = null;
  let spared = false;
  if (LADDERS[landed]) jump = { type: 'ladder', from: landed, to: LADDERS[landed] };
  else if (SNAKES[landed] && answer === true) spared = true;
  else if (SNAKES[landed]) jump = { type: 'snake', from: landed, to: SNAKES[landed] };
  const to = jump ? jump.to : landed;

  return {
    from,
    roll,
    steps,
    landed,
    jump,
    to,
    bounced,
    blocked,
    answer: SNAKES[landed] ? answer : null,
    spared,
    won: to === FINAL_SQUARE,
  };
}

// players: [{ name, color, bot }]
// karmaQuestions: stopping on a purple lotus asks a right-or-wrong question
// first, and only a wrong answer slides the token down.
export function createGame({ players, finishRule = FINISH_RULES.EXACT, karmaQuestions = false }) {
  if (!Array.isArray(players) || players.length < MIN_PLAYERS || players.length > MAX_PLAYERS) {
    throw new RangeError(`A game needs ${MIN_PLAYERS}-${MAX_PLAYERS} players`);
  }
  if (!Object.values(FINISH_RULES).includes(finishRule)) {
    throw new RangeError(`Unknown finish rule: ${finishRule}`);
  }
  return {
    players: players.map((p, id) => ({
      id,
      name: p.name,
      color: p.color,
      bot: Boolean(p.bot),
      pos: START_SQUARE,
      rolls: 0,
    })),
    current: 0,
    finishRule,
    karmaQuestions: Boolean(karmaQuestions),
    winner: null,
    history: [],
  };
}

// True when this roll stops the current player on a purple lotus and the game
// has to ask its karma question before the move can be completed.
export function needsQuestion(state, roll) {
  if (!state.karmaQuestions) return false;
  const player = state.players[state.current];
  return Boolean(SNAKES[planMove(player.pos, roll, state.finishRule).landed]);
}

// Applies one roll for the current player. Returns the new state and the move
// that was made; the input state is left untouched. When needsQuestion() is
// true, pass whether the karma question was answered correctly.
export function takeTurn(state, roll, answer = null) {
  if (state.winner !== null) throw new Error('The game is already over');
  if (!Number.isInteger(roll) || roll < 1 || roll > 6) throw new RangeError(`Invalid roll: ${roll}`);
  const asked = needsQuestion(state, roll);
  if (asked && typeof answer !== 'boolean') {
    throw new TypeError('This roll stops on a purple lotus: say whether the question was answered correctly');
  }

  const player = state.players[state.current];
  const move = { player: player.id, ...planMove(player.pos, roll, state.finishRule, asked ? answer : null) };
  const players = state.players.map((p) =>
    p.id === player.id ? { ...p, pos: move.to, rolls: p.rolls + 1 } : p,
  );
  const winner = move.won ? player.id : null;

  return {
    state: {
      ...state,
      players,
      winner,
      current: winner === null ? (state.current + 1) % players.length : state.current,
      history: [...state.history, move],
    },
    move,
  };
}

// Light validation for a game restored from storage.
export function isValidState(state) {
  if (!state || !Array.isArray(state.players)) return false;
  if (state.players.length < MIN_PLAYERS || state.players.length > MAX_PLAYERS) return false;
  if (!Object.values(FINISH_RULES).includes(state.finishRule)) return false;
  if (typeof state.karmaQuestions !== 'boolean') return false;
  if (!Number.isInteger(state.current) || state.current < 0 || state.current >= state.players.length) return false;
  if (state.winner !== null && !state.players.some((p) => p.id === state.winner)) return false;
  if (!Array.isArray(state.history)) return false;
  const count = state.players.length;
  const squareOk = (n) => Number.isInteger(n) && n >= START_SQUARE && n <= FINAL_SQUARE;
  const historyOk = state.history.every(
    (m) =>
      m &&
      Number.isInteger(m.player) &&
      m.player >= 0 &&
      m.player < count &&
      Number.isInteger(m.roll) &&
      squareOk(m.from) &&
      squareOk(m.landed) &&
      squareOk(m.to),
  );
  if (!historyOk) return false;
  return state.players.every(
    (p, i) =>
      p.id === i &&
      typeof p.name === 'string' &&
      typeof p.color === 'string' &&
      Number.isInteger(p.pos) &&
      p.pos >= START_SQUARE &&
      p.pos <= FINAL_SQUARE,
  );
}
