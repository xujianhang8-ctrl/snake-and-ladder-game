// UI text in Chinese (default, matching the board) and English.

const STRINGS = {
  zh: {
    htmlLang: 'zh-CN',
    pageTitle: '莲花因果棋',
    boardAlt: '莲花因果棋棋盘：1 至 100 号莲花，金色莲花为功德晋升，紫色莲花为因果退步',
    newGame: '新游戏',
    rules: '规则',
    soundOn: '声音：开',
    soundOff: '声音：关',
    langSwitch: 'EN',
    langSwitchLabel: 'Switch to English',
    playersTitle: '玩家',
    logTitle: '行棋记录',
    logEmpty: '尚无记录',
    square: (n) => `第 ${n} 格`,
    botTag: '电脑',
    you: '真人',
    colors: ['粉莲', '金莲', '紫莲', '蓝莲'],
    dice: '掷骰子',
    diceHint: '点击骰子或按空格键掷骰',

    setupTitle: '莲花因果棋',
    setupSubtitle: '莲池步步生莲',
    playerCount: '玩家人数',
    playerName: (i) => `玩家 ${i} 名字`,
    playerType: (i) => `玩家 ${i} 类型`,
    finishRule: '终点规则',
    ruleExact: '需恰好到达 100，点数超出则原地不动',
    ruleBounce: '点数超出时，到达 100 后反弹后退',
    questionsTitle: '因果问答',
    questionsLabel: '停在紫色莲花时回答一道是非题，答对就不用退步',
    start: '开始游戏',
    cancel: '取消',

    turnHuman: (name) => `轮到 ${name} 掷骰`,
    turnBot: (name) => `轮到 ${name}（电脑）`,
    rolling: (name) => `${name} 掷骰中…`,
    rolled: (name, n) => `${name} 掷出 ${n} 点`,
    moved: (name, a, b) => `${name}：${a} → ${b}`,
    ladder: (name, a, b) => `✦ 功德晋升！${name}：${a} → ${b}`,
    snake: (name, a, b) => `◎ 因果退步…${name}：${a} → ${b}`,
    blocked: (name, need) => `${name} 需恰好掷出 ${need} 点才能到达终点`,
    bounced: (name, a, b) => `${name} 超出终点，反弹：${a} → ${b}`,
    won: (name) => `${name} 往生西方极乐世界！`,
    answering: (name) => `${name} 答题中…`,
    spared: (name, n) => `✦ 答对了！${name} 留在 ${n}`,
    wrong: (name, a, b) => `◎ 答错退步…${name}：${a} → ${b}`,
    floatSafe: '✓ 免退',

    karmaTitle: '因果考验',
    karmaIntro: (name, n) => `${name} 停在紫色莲花 ${n} 上。答对了就不用退步！`,
    judgePrompt: '这样做对吗？',
    judgeChoices: ['对', '不对'],
    readAloud: '读题',
    botThinking: (name) => `${name}（电脑）正在想…`,
    correct: '答对了！功德护身，不用退步。',
    incorrect: '答错了，要沿紫色莲径退步啦。',
    rightAnswer: (text) => `正确答案：${text}`,
    continue: '继续',

    logRoll: (name, n) => `${name} 掷出 ${n}`,
    logMove: (a, b) => `${a} → ${b}`,
    logLadder: (a, b) => `功德晋升 ${a} → ${b}`,
    logSnake: (a, b) => `因果退步 ${a} → ${b}`,
    logBlocked: '超出终点，原地不动',
    logBounce: '反弹',
    logWin: '到达终点',
    logSpared: '答对，免于退步',
    logWrong: (a, b) => `答错退步 ${a} → ${b}`,

    winTitle: '功德圆满',
    winText: (name) => `${name} 往生西方极乐世界`,
    winStats: (n) => `共掷骰 ${n} 次`,
    playAgain: '再来一局',

    rulesTitle: '游戏规则',
    rulesList: [
      '2–4 人轮流掷骰，所有棋子从「起点」1 号莲花出发，按点数向前走。',
      '停在<b class="gold">金色莲花</b>上（功德：行善晋升），沿金色莲径升到上方的莲花。',
      '停在<b class="purple">紫色莲花</b>上（因果：答错退步），要回答一道是非题：答对了留在原地，答错了就沿紫色莲径退回下方的莲花。在「新游戏」里可以关掉问答，改用经典规则。',
      '最先到达 100 号「西方极乐世界」者获胜。点数超出 100 时按开局所选的终点规则处理。',
      '可选择电脑玩家，电脑也会答题；按空格键也能掷骰，按 1、2、3 键可以选答案。游戏进度会自动保存在本机浏览器中。',
    ],
    close: '知道了',
  },
  en: {
    htmlLang: 'en',
    pageTitle: 'Lotus Karma',
    boardAlt: 'Lotus Karma board: lotuses numbered 1 to 100, golden lotuses climb up, purple lotuses slide down',
    newGame: 'New game',
    rules: 'Rules',
    soundOn: 'Sound: on',
    soundOff: 'Sound: off',
    langSwitch: '中文',
    langSwitchLabel: '切换到中文',
    playersTitle: 'Players',
    logTitle: 'Moves',
    logEmpty: 'No moves yet',
    square: (n) => `Square ${n}`,
    botTag: 'Computer',
    you: 'Human',
    colors: ['Pink Lotus', 'Gold Lotus', 'Purple Lotus', 'Blue Lotus'],
    dice: 'Roll the dice',
    diceHint: 'Click the dice or press Space to roll',

    setupTitle: 'Lotus Karma',
    setupSubtitle: 'A lotus blooms with every step',
    playerCount: 'Players',
    playerName: (i) => `Player ${i} name`,
    playerType: (i) => `Player ${i} type`,
    finishRule: 'Finishing',
    ruleExact: 'Land exactly on 100 — stay put if the roll is too high',
    ruleBounce: 'Bounce back from 100 if the roll is too high',
    questionsTitle: 'Karma questions',
    questionsLabel: 'On a purple lotus, answer a right-or-wrong question. Get it right and you don’t slide down',
    start: 'Start',
    cancel: 'Cancel',

    turnHuman: (name) => `${name} to roll`,
    turnBot: (name) => `${name} (computer) to roll`,
    rolling: (name) => `${name} is rolling…`,
    rolled: (name, n) => `${name} rolled ${n}`,
    moved: (name, a, b) => `${name}: ${a} → ${b}`,
    ladder: (name, a, b) => `✦ Merit! ${name} climbs ${a} → ${b}`,
    snake: (name, a, b) => `◎ Karma… ${name} slides ${a} → ${b}`,
    blocked: (name, need) => `${name} needs exactly ${need} to finish`,
    bounced: (name, a, b) => `${name} overshot and bounced back: ${a} → ${b}`,
    won: (name) => `${name} reached the Western Pure Land!`,
    answering: (name) => `${name} is answering…`,
    spared: (name, n) => `✦ Correct! ${name} stays on ${n}`,
    wrong: (name, a, b) => `◎ Wrong answer… ${name} slides ${a} → ${b}`,
    floatSafe: '✓ Safe',

    karmaTitle: 'Karma question',
    karmaIntro: (name, n) => `${name} stopped on purple lotus ${n}. Answer correctly and you won’t slide down!`,
    judgePrompt: 'Is this right or wrong?',
    judgeChoices: ['Right', 'Wrong'],
    readAloud: 'Read aloud',
    botThinking: (name) => `${name} (computer) is thinking…`,
    correct: 'Correct! Your good heart keeps you on this lotus.',
    incorrect: 'Not quite. Down the purple path you go.',
    rightAnswer: (text) => `The right answer: ${text}`,
    continue: 'Continue',

    logRoll: (name, n) => `${name} rolled ${n}`,
    logMove: (a, b) => `${a} → ${b}`,
    logLadder: (a, b) => `merit, climbs ${a} → ${b}`,
    logSnake: (a, b) => `karma, slides ${a} → ${b}`,
    logBlocked: 'too high, stays put',
    logBounce: 'bounced',
    logWin: 'finished',
    logSpared: 'answered right, stays',
    logWrong: (a, b) => `answered wrong, slides ${a} → ${b}`,

    winTitle: 'Enlightened!',
    winText: (name) => `${name} reached the Western Pure Land`,
    winStats: (n) => `in ${n} rolls`,
    playAgain: 'Play again',

    rulesTitle: 'How to play',
    rulesList: [
      '2–4 players take turns rolling the dice. Every token starts on lotus 1 (起点, “start”) and moves forward by the number rolled.',
      'Stop on a <b class="gold">golden lotus</b> (merit) and you climb the golden path to the lotus above — the ladders.',
      'Stop on a <b class="purple">purple lotus</b> (karma) and you get a right-or-wrong question. Answer correctly and you stay where you are; answer wrong and you slide down the purple path, like a snake. You can turn the questions off under New game to play the classic way.',
      'The first to reach 100, the Western Pure Land (西方极乐世界), wins. A roll that overshoots 100 follows the finishing rule chosen at the start.',
      'Any seat can be played by the computer, which answers questions too. Space rolls the dice and keys 1, 2, 3 pick an answer. Your game is saved in this browser automatically.',
    ],
    close: 'Got it',
  },
};

export const LANGS = Object.keys(STRINGS);
let lang = 'zh';

export function setLang(next) {
  if (STRINGS[next]) lang = next;
  return lang;
}

export function getLang() {
  return lang;
}

// t('key') for plain strings, t('key', ...args) for templates.
export function t(key, ...args) {
  const value = STRINGS[lang][key] ?? STRINGS.zh[key];
  return typeof value === 'function' ? value(...args) : value;
}
