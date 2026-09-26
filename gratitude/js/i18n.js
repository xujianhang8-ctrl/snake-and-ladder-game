// UI text in English (default) and Chinese.

const STRINGS = {
  en: {
    htmlLang: 'en',
    pageTitle: 'Journey to Gratitude',
    boardAlt:
      'Journey to Gratitude board: hearts numbered 1 to 100 along a winding trail. Golden hearts lead up golden paths; purple hearts ask a question and lead down purple paths.',
    boardTitle: 'Journey to Gratitude',
    boardSubtitle: 'A thankful heart grows with every step',
    legendUp: 'Golden hearts: climb up',
    legendDown: (questions) => (questions ? 'Purple hearts: answer a question' : 'Purple hearts: slide down'),
    goalLabel: 'Heart of Gratitude',
    startLabel: 'Start',
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
    colors: ['Rosy', 'Sunny', 'Violet', 'Sky'],
    dice: 'Roll the dice',
    diceHint: 'Click the dice or press Space to roll',

    setupTitle: 'Journey to Gratitude',
    setupSubtitle: 'A thankful heart grows with every step',
    playerCount: 'Players',
    playerName: (i) => `Player ${i} name`,
    playerType: (i) => `Player ${i} type`,
    finishRule: 'Finishing',
    ruleExact: 'Land exactly on 100 — stay put if the roll is too high',
    ruleBounce: 'Bounce back from 100 if the roll is too high',
    questionsTitle: 'Heart questions',
    questionsLabel: 'On a purple heart, answer a question. Get it right and you don’t slide down',
    start: 'Start',
    cancel: 'Cancel',

    turnHuman: (name) => `${name} to roll`,
    turnBot: (name) => `${name} (computer) to roll`,
    rolling: (name) => `${name} is rolling…`,
    rolled: (name, n) => `${name} rolled ${n}`,
    moved: (name, a, b) => `${name}: ${a} → ${b}`,
    ladder: (name, a, b) => `✦ Thankful heart! ${name} climbs ${a} → ${b}`,
    snake: (name, a, b) => `◎ Oops… ${name} slides ${a} → ${b}`,
    blocked: (name, need) => `${name} needs exactly ${need} to finish`,
    bounced: (name, a, b) => `${name} overshot and bounced back: ${a} → ${b}`,
    won: (name) => `${name} reached the Heart of Gratitude!`,
    answering: (name) => `${name} is answering…`,
    spared: (name, n) => `✦ Correct! ${name} stays on ${n}`,
    wrong: (name, a, b) => `◎ Wrong answer… ${name} slides ${a} → ${b}`,
    floatSafe: '✓ Safe',

    questionTitle: 'Heart question',
    questionIntro: (name, n) => `${name} stopped on purple heart ${n}. Answer correctly and you won’t slide down!`,
    judgePrompt: 'Is this right or wrong?',
    judgeChoices: ['Right', 'Wrong'],
    readAloud: 'Read aloud',
    botThinking: (name) => `${name} (computer) is thinking…`,
    correct: 'Correct! Your kind heart keeps you on this square.',
    incorrect: 'Not quite. Down the purple path you go.',
    rightAnswer: (text) => `The right answer: ${text}`,
    continue: 'Continue',

    logRoll: (name, n) => `${name} rolled ${n}`,
    logMove: (a, b) => `${a} → ${b}`,
    logLadder: (a, b) => `thankful heart, climbs ${a} → ${b}`,
    logSnake: (a, b) => `slides ${a} → ${b}`,
    logBlocked: 'too high, stays put',
    logBounce: 'bounced',
    logWin: 'finished',
    logSpared: 'answered right, stays',
    logWrong: (a, b) => `answered wrong, slides ${a} → ${b}`,

    winTitle: 'Full of gratitude!',
    winText: (name) => `${name} reached the Heart of Gratitude`,
    winStats: (n) => `in ${n} rolls`,
    playAgain: 'Play again',

    rulesTitle: 'How to play',
    rulesList: [
      '2–4 players take turns rolling the dice. Every token starts on heart 1 (Start) and moves forward by the number rolled, following the trail: left to right along the bottom row, then right to left, winding up the board.',
      'Stop on a <b class="gold">golden heart</b> and gratitude lifts you up: climb the golden path to the heart above. These are the ladders.',
      'Stop on a <b class="purple">purple heart</b> and you get a heart question. Answer correctly and you stay where you are; answer wrong and you slide down the purple path, like a snake. You can turn the questions off under New game to play the classic way.',
      'The first to reach 100, the Heart of Gratitude, wins. A roll that overshoots 100 follows the finishing rule chosen at the start.',
      'Any seat can be played by the computer, which answers questions too. Space rolls the dice and keys 1, 2, 3 pick an answer. Your game is saved in this browser automatically.',
    ],
    close: 'Got it',
  },
  zh: {
    htmlLang: 'zh-CN',
    pageTitle: '感恩之旅',
    boardAlt: '感恩之旅棋盘：1 至 100 号爱心沿小路排列。金色爱心沿金色小路向上；紫色爱心要回答问题，答错沿紫色小路退步。',
    boardTitle: '感恩之旅',
    boardSubtitle: '心怀感恩，一路向前',
    legendUp: '金色爱心：感恩向上',
    legendDown: (questions) => (questions ? '紫色爱心：答错退步' : '紫色爱心：沿紫色小路退步'),
    goalLabel: '感恩之心',
    startLabel: '起点',
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
    colors: ['小粉', '小金', '小紫', '小蓝'],
    dice: '掷骰子',
    diceHint: '点击骰子或按空格键掷骰',

    setupTitle: '感恩之旅',
    setupSubtitle: '心怀感恩，一路向前',
    playerCount: '玩家人数',
    playerName: (i) => `玩家 ${i} 名字`,
    playerType: (i) => `玩家 ${i} 类型`,
    finishRule: '终点规则',
    ruleExact: '需恰好到达 100，点数超出则原地不动',
    ruleBounce: '点数超出时，到达 100 后反弹后退',
    questionsTitle: '爱心问答',
    questionsLabel: '停在紫色爱心时回答一道题，答对就不用退步',
    start: '开始游戏',
    cancel: '取消',

    turnHuman: (name) => `轮到 ${name} 掷骰`,
    turnBot: (name) => `轮到 ${name}（电脑）`,
    rolling: (name) => `${name} 掷骰中…`,
    rolled: (name, n) => `${name} 掷出 ${n} 点`,
    moved: (name, a, b) => `${name}：${a} → ${b}`,
    ladder: (name, a, b) => `✦ 感恩向上！${name}：${a} → ${b}`,
    snake: (name, a, b) => `◎ 哎呀，退步了…${name}：${a} → ${b}`,
    blocked: (name, need) => `${name} 需恰好掷出 ${need} 点才能到达终点`,
    bounced: (name, a, b) => `${name} 超出终点，反弹：${a} → ${b}`,
    won: (name) => `${name} 到达感恩之心！`,
    answering: (name) => `${name} 答题中…`,
    spared: (name, n) => `✦ 答对了！${name} 留在 ${n}`,
    wrong: (name, a, b) => `◎ 答错退步…${name}：${a} → ${b}`,
    floatSafe: '✓ 免退',

    questionTitle: '爱心问答',
    questionIntro: (name, n) => `${name} 停在紫色爱心 ${n} 上。答对了就不用退步！`,
    judgePrompt: '这样做对吗？',
    judgeChoices: ['对', '不对'],
    readAloud: '读题',
    botThinking: (name) => `${name}（电脑）正在想…`,
    correct: '答对了！善良的心让你留在原地。',
    incorrect: '答错了，要沿紫色小路退步啦。',
    rightAnswer: (text) => `正确答案：${text}`,
    continue: '继续',

    logRoll: (name, n) => `${name} 掷出 ${n}`,
    logMove: (a, b) => `${a} → ${b}`,
    logLadder: (a, b) => `感恩向上 ${a} → ${b}`,
    logSnake: (a, b) => `退步 ${a} → ${b}`,
    logBlocked: '超出终点，原地不动',
    logBounce: '反弹',
    logWin: '到达终点',
    logSpared: '答对，免于退步',
    logWrong: (a, b) => `答错退步 ${a} → ${b}`,

    winTitle: '感恩满满！',
    winText: (name) => `${name} 到达了感恩之心`,
    winStats: (n) => `共掷骰 ${n} 次`,
    playAgain: '再来一局',

    rulesTitle: '游戏规则',
    rulesList: [
      '2–4 人轮流掷骰，所有棋子从「起点」1 号爱心出发，按点数沿着小路向前走：第一行从左往右，第二行从右往左，一路蜿蜒向上。',
      '停在<b class="gold">金色爱心</b>上（感恩向上），沿金色小路升到上方的爱心。',
      '停在<b class="purple">紫色爱心</b>上，要回答一道爱心问答：答对了留在原地，答错了就沿紫色小路退回下方的爱心。在「新游戏」里可以关掉问答，改用经典规则。',
      '最先到达 100 号「感恩之心」者获胜。点数超出 100 时按开局所选的终点规则处理。',
      '可选择电脑玩家，电脑也会答题；按空格键也能掷骰，按 1、2、3 键可以选答案。游戏进度会自动保存在本机浏览器中。',
    ],
    close: '知道了',
  },
};

export const STRING_TABLES = STRINGS;
export const LANGS = Object.keys(STRINGS);
let lang = 'en';

export function setLang(next) {
  if (STRINGS[next]) lang = next;
  return lang;
}

export function getLang() {
  return lang;
}

// t('key') for plain strings, t('key', ...args) for templates.
export function t(key, ...args) {
  const value = STRINGS[lang][key] ?? STRINGS.en[key];
  return typeof value === 'function' ? value(...args) : value;
}
