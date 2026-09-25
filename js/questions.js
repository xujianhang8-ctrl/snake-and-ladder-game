// Right-or-wrong questions for children aged about 5–9, asked when a token
// stops on a purple lotus (因果：答错退步).
//
// Two kinds of question:
// - Scenario questions: `choices` lists the right answer FIRST; the order is
//   shuffled every time the question is shown. `emoji` gives one picture per
//   choice (same order) to help children who are still learning to read.
// - Statement questions (`judge: true`): the child decides whether the
//   behaviour described is right (`answer: true`) or wrong (`answer: false`).
//
// Every question has a short `why` that is shown after answering.

export const QUESTIONS = [
  {
    id: 'fall',
    emoji: ['🤝', '😂', '🙈'],
    zh: {
      question: '同学在操场上摔倒了，你应该怎么做？',
      choices: ['扶他起来，问他疼不疼', '在旁边哈哈大笑', '假装没看见，走开'],
      why: '关心别人、帮助别人，是善良的表现。',
    },
    en: {
      question: 'A classmate falls over in the playground. What should you do?',
      choices: ['Help them up and ask if they are OK', 'Laugh at them', 'Pretend you didn’t see and walk away'],
      why: 'Caring about others and helping them is kind.',
    },
  },
  {
    id: 'blocks',
    emoji: ['🙏', '🏃', '👉'],
    zh: {
      question: '你不小心撞倒了小朋友搭的积木，应该怎么做？',
      choices: ['说对不起，帮他一起搭好', '赶快跑开', '说是别人弄倒的'],
      why: '做错了事要勇敢承认，还要想办法弥补。',
    },
    en: {
      question: 'You knock over a friend’s block tower by accident. What should you do?',
      choices: ['Say sorry and help build it again', 'Run away quickly', 'Say someone else did it'],
      why: 'When we make a mistake, we own up and help fix it.',
    },
  },
  {
    id: 'wallet',
    emoji: ['👮', '🍭', '🗑️'],
    zh: {
      question: '你在路边捡到一个钱包，应该怎么做？',
      choices: ['交给警察或者身边的大人', '用里面的钱去买糖果', '扔进垃圾桶'],
      why: '捡到东西要还给失主，这叫拾金不昧。',
    },
    en: {
      question: 'You find a wallet on the ground. What should you do?',
      choices: ['Give it to a police officer or a grown-up', 'Spend the money on candy', 'Throw it in the bin'],
      why: 'Things we find belong to someone, so we help give them back.',
    },
  },
  {
    id: 'share-toy',
    emoji: ['🧸', '😠', '🙊'],
    zh: {
      question: '小朋友想玩你的新玩具，你可以怎么做？',
      choices: ['和他轮流玩', '大喊“不给！”然后推开他', '把玩具藏起来'],
      why: '分享会让快乐变成两份。',
    },
    en: {
      question: 'A friend wants to play with your new toy. What can you do?',
      choices: ['Take turns playing with it', 'Shout “No!” and push them away', 'Hide the toy'],
      why: 'Sharing makes the fun twice as big.',
    },
  },
  {
    id: 'road',
    emoji: ['🚦', '🏃', '📱'],
    zh: {
      question: '过马路的时候，应该怎么做？',
      choices: ['等绿灯，走斑马线，牵着大人的手', '看到车少就快点跑过去', '边走边看手机'],
      why: '遵守交通规则，才能保护好自己。',
    },
    en: {
      question: 'How should you cross the road?',
      choices: [
        'Wait for the green light, use the crosswalk and hold a grown-up’s hand',
        'Run across when there are not many cars',
        'Look at a phone while you walk',
      ],
      why: 'Following the road rules keeps you safe.',
    },
  },
  {
    id: 'stranger',
    emoji: ['🙅', '🍬', '🤫'],
    zh: {
      question: '一个不认识的人说要给你糖，还要带你去看小狗，你应该怎么做？',
      choices: ['不跟他走，马上告诉爸爸妈妈或老师', '拿了糖就跟他走', '偷偷跟他去看一下'],
      why: '不跟陌生人走。遇到这种事，要马上告诉信任的大人。',
    },
    en: {
      question: 'Someone you don’t know offers you candy and says they will show you some puppies. What should you do?',
      choices: ['Say no and tell your parents or teacher right away', 'Take the candy and go with them', 'Sneak off with them for a quick look'],
      why: 'Never go anywhere with a stranger. Tell a grown-up you trust.',
    },
  },
  {
    id: 'help-mom',
    emoji: ['🍽️', '📺', '😤'],
    zh: {
      question: '妈妈做完饭很累了，你可以做什么？',
      choices: ['帮忙摆碗筷、收拾桌子', '继续看电视，喊“快点开饭”', '说饭菜不好吃'],
      why: '家人互相帮忙，家里才更温暖。',
    },
    en: {
      question: 'Mom is tired after cooking dinner. What can you do?',
      choices: ['Help set the table and clear up', 'Keep watching TV and shout “Hurry up!”', 'Say the food is yucky'],
      why: 'When a family helps each other, home feels warmer.',
    },
  },
  {
    id: 'vase',
    emoji: ['🗣️', '🐱', '🧹'],
    zh: {
      question: '你不小心打碎了家里的花瓶，应该怎么做？',
      choices: ['诚实地告诉爸爸妈妈', '说是小猫打碎的', '偷偷把碎片藏起来'],
      why: '诚实最可贵。说出真话，大人才能帮你，碎片也很危险哦。',
    },
    en: {
      question: 'You accidentally break a vase at home. What should you do?',
      choices: ['Tell your parents the truth', 'Say the cat did it', 'Hide the pieces'],
      why: 'Honesty matters. Tell the truth so a grown-up can help, and broken pieces are sharp!',
    },
  },
  {
    id: 'bullied',
    emoji: ['🤗', '😆', '🚶'],
    zh: {
      question: '你看到有同学被别人欺负，你可以怎么做？',
      choices: ['告诉老师，并安慰被欺负的同学', '在旁边一起起哄', '走开，当作没看见'],
      why: '看到欺负人的事，要找大人帮忙，也要关心被欺负的人。',
    },
    en: {
      question: 'You see someone being picked on. What can you do?',
      choices: ['Tell a teacher and comfort the child', 'Join in and cheer', 'Walk away and do nothing'],
      why: 'Get help from a grown-up and be kind to the one who was hurt.',
    },
  },
  {
    id: 'queue',
    emoji: ['⏳', '🏃', '💪'],
    zh: {
      question: '大家在排队玩滑梯，你应该怎么做？',
      choices: ['排好队，等轮到自己', '从旁边插队', '把前面的小朋友推开'],
      why: '排队守秩序，对每个人都公平。',
    },
    en: {
      question: 'Everyone is lining up for the slide. What should you do?',
      choices: ['Wait in line for your turn', 'Cut in at the front', 'Push the child in front of you'],
      why: 'Waiting your turn is fair to everyone.',
    },
  },
  {
    id: 'banana',
    emoji: ['🗑️', '🌳', '🚗'],
    zh: {
      question: '吃完香蕉，香蕉皮应该怎么处理？',
      choices: ['扔进垃圾桶', '随手扔在路边', '从车窗扔出去'],
      why: '不乱扔垃圾，爱护环境。香蕉皮还会让人滑倒呢！',
    },
    en: {
      question: 'You finish a banana. What do you do with the peel?',
      choices: ['Put it in the bin', 'Drop it on the path', 'Throw it out of the car window'],
      why: 'Don’t litter. A banana peel on the ground can make someone slip!',
    },
  },
  {
    id: 'ant',
    emoji: ['👀', '🦶', '💦'],
    zh: {
      question: '你看到一只小蚂蚁在地上爬，你应该怎么做？',
      choices: ['静静地看，不去伤害它', '用脚踩它', '用水冲走它来玩'],
      why: '小动物也有生命，我们要爱护它们。',
    },
    en: {
      question: 'You see a little ant crawling on the ground. What should you do?',
      choices: ['Watch it quietly and leave it alone', 'Step on it', 'Wash it away with water for fun'],
      why: 'Little creatures are alive too, so we are gentle with them.',
    },
  },
  {
    id: 'gift',
    emoji: ['😊', '😒', '🤐'],
    zh: {
      question: '朋友送给你一个礼物，你应该说什么？',
      choices: ['“谢谢你！”', '“我不喜欢这个。”', '什么也不说，拿了就走'],
      why: '收到礼物和帮助，要真诚地说谢谢。',
    },
    en: {
      question: 'A friend gives you a present. What should you say?',
      choices: ['“Thank you!”', '“I don’t like this.”', 'Nothing, just take it and go'],
      why: 'Always say thank you for presents and help.',
    },
  },
  {
    id: 'raise-hand',
    emoji: ['✋', '📢', '💬'],
    zh: {
      question: '老师正在讲故事，你想说话，应该怎么做？',
      choices: ['举手，等老师叫到你', '大声插嘴', '和旁边的同学聊天'],
      why: '别人说话时认真听，是对别人的尊重。',
    },
    en: {
      question: 'Your teacher is reading a story and you want to say something. What should you do?',
      choices: ['Raise your hand and wait', 'Shout out and interrupt', 'Chat with the child next to you'],
      why: 'Listening when others talk shows respect.',
    },
  },
  {
    id: 'borrow',
    emoji: ['🙋', '✊', '🎒'],
    zh: {
      question: '你想玩好朋友的玩具车，应该怎么做？',
      choices: ['先问他：“可以借我玩一下吗？”', '直接抢过来', '趁他不注意放进自己书包'],
      why: '别人的东西，要先问过才能拿。',
    },
    en: {
      question: 'You want to play with your friend’s toy car. What should you do?',
      choices: ['Ask: “May I play with it, please?”', 'Grab it from them', 'Put it in your bag when they aren’t looking'],
      why: 'Always ask before using other people’s things.',
    },
  },
  {
    id: 'umbrella',
    emoji: ['☂️', '😜', '🏃'],
    zh: {
      question: '下雨了，同学没有带伞，你可以怎么做？',
      choices: ['和他一起撑伞', '笑他会被淋成落汤鸡', '自己赶快跑走'],
      why: '帮助别人，自己也会很快乐。',
    },
    en: {
      question: 'It starts to rain and your classmate has no umbrella. What can you do?',
      choices: ['Share your umbrella', 'Laugh that they will get soaked', 'Run off by yourself'],
      why: 'Helping others makes you happy too.',
    },
  },
  {
    id: 'lose',
    emoji: ['🤝', '😭', '😤'],
    zh: {
      question: '玩游戏输了，你应该怎么做？',
      choices: ['对赢的人说“你真棒”，下次再加油', '发脾气，把棋子扔掉', '说对方作弊'],
      why: '输了也要有风度，这才是好玩家。',
    },
    en: {
      question: 'You lose a game. What should you do?',
      choices: ['Say “Well played!” and try again next time', 'Get angry and throw the pieces', 'Say the other player cheated'],
      why: 'Good players are kind even when they lose.',
    },
  },
  {
    id: 'flowers',
    emoji: ['🌸', '✂️', '🦶'],
    zh: {
      question: '你在公园看到漂亮的花，你应该怎么做？',
      choices: ['欣赏它，不去摘', '摘下来带回家', '踩着花丛跑过去'],
      why: '花草也有生命，留给大家一起欣赏。',
    },
    en: {
      question: 'You see beautiful flowers in the park. What should you do?',
      choices: ['Enjoy them without picking them', 'Pick them and take them home', 'Run through the flowerbed'],
      why: 'Flowers are alive and are there for everyone to enjoy.',
    },
  },
  {
    id: 'tap',
    emoji: ['🚰', '🌊', '⚽'],
    zh: {
      question: '刷牙的时候，水龙头应该怎么样？',
      choices: ['先关上，要用水时再打开', '一直开着', '开着水跑去玩一会儿'],
      why: '节约用水，从身边的小事做起。',
    },
    en: {
      question: 'While you brush your teeth, what should you do with the tap?',
      choices: ['Turn it off until you need water', 'Leave it running the whole time', 'Leave it on and go play'],
      why: 'Saving water starts with small things.',
    },
  },
  {
    id: 'grandparents',
    emoji: ['🙂', '🙉', '🎮'],
    zh: {
      question: '爷爷奶奶来家里做客，你应该怎么做？',
      choices: ['主动问好，请他们坐下', '躲在房间里不出来', '只顾着玩游戏，不理他们'],
      why: '尊敬长辈、懂礼貌，是好孩子。',
    },
    en: {
      question: 'Grandma and Grandpa come to visit. What should you do?',
      choices: ['Say hello and offer them a seat', 'Hide in your room', 'Keep playing games and ignore them'],
      why: 'Being polite to older people shows respect.',
    },
  },
  {
    id: 'promise',
    emoji: ['✅', '🤷', '🤥'],
    zh: {
      question: '你答应了朋友明天一起玩，第二天应该怎么做？',
      choices: ['说话算话，按时去找他', '忘了就算了', '骗他说自己生病了'],
      why: '说话算话，别人才会相信你。',
    },
    en: {
      question: 'You promised to play with a friend tomorrow. What should you do the next day?',
      choices: ['Keep your promise and meet them', 'Forget about it', 'Pretend you are sick'],
      why: 'Keeping promises helps people trust you.',
    },
  },
  {
    id: 'quiz',
    emoji: ['✏️', '👀', '📖'],
    zh: {
      question: '小测验时有一道题你不会，应该怎么做？',
      choices: ['自己认真想，不会的下课再问老师', '偷看同学的答案', '偷偷翻书找答案'],
      why: '诚实地做题，不会的地方可以慢慢学。',
    },
    en: {
      question: 'During a class quiz there is a question you can’t answer. What should you do?',
      choices: ['Do your best and ask the teacher afterwards', 'Copy from a classmate', 'Sneak a look in your book'],
      why: 'Do your own work honestly. You can always learn what you don’t know yet.',
    },
  },
  {
    id: 'dog',
    emoji: ['🐶', '💥', '😖'],
    zh: {
      question: '你想摸邻居家的小狗，应该怎么做？',
      choices: ['先问主人可不可以，再轻轻地摸', '拿石头吓唬它', '去拉它的尾巴'],
      why: '对小动物要温柔，摸之前也要先问主人。',
    },
    en: {
      question: 'You want to pet your neighbor’s dog. What should you do?',
      choices: ['Ask the owner first, then pet it gently', 'Throw a stone to scare it', 'Pull its tail'],
      why: 'Be gentle with animals, and ask the owner first.',
    },
  },
  {
    id: 'drawing',
    emoji: ['🌈', '😝', '🗑️'],
    zh: {
      question: '同学给你看他的画，你觉得画得不太好看，你可以说什么？',
      choices: ['“我喜欢你用的颜色！”', '“好丑啊！”', '把画揉成一团'],
      why: '说温和的话，多看看别人的优点。',
    },
    en: {
      question: 'A classmate shows you a drawing you don’t really like. What could you say?',
      choices: ['“I like the colors you used!”', '“That’s so ugly!”', 'Crumple it up'],
      why: 'Use kind words and look for what is good.',
    },
  },
  {
    id: 'library',
    emoji: ['🤫', '📢', '🖍️'],
    zh: {
      question: '在图书馆里，你应该怎么做？',
      choices: ['小声说话，轻轻翻书', '跑来跑去，大声喊叫', '在书上乱涂乱画'],
      why: '公共场所要安静，也要爱护大家的东西。',
    },
    en: {
      question: 'How should you behave in the library?',
      choices: ['Talk quietly and turn pages gently', 'Run around and shout', 'Scribble in the books'],
      why: 'Be quiet in shared places and take care of shared things.',
    },
  },
  {
    id: 'new-kid',
    emoji: ['👋', '🙄', '🤭'],
    zh: {
      question: '有个新同学一个人坐着，看起来很孤单，你可以怎么做？',
      choices: ['邀请他一起玩', '说“我们不跟你玩”', '和别人一起笑话他'],
      why: '一句“一起玩吧”，就能让别人开心一整天。',
    },
    en: {
      question: 'A new child is sitting alone and looks lonely. What can you do?',
      choices: ['Invite them to play', 'Say “We don’t play with you”', 'Laugh at them with others'],
      why: '“Want to play?” can make someone’s whole day.',
    },
  },
  {
    id: 'bedtime',
    emoji: ['🛏️', '😫', '🔦'],
    zh: {
      question: '爸爸妈妈说该睡觉了，可你还想玩，应该怎么做？',
      choices: ['收好玩具，按时去睡觉', '大哭大闹，不肯睡觉', '躲在被子里偷偷玩'],
      why: '按时睡觉，身体才能长得棒棒的。',
    },
    en: {
      question: 'Your parents say it’s bedtime, but you want to keep playing. What should you do?',
      choices: ['Tidy up and go to bed on time', 'Scream and refuse to sleep', 'Play secretly under the blanket'],
      why: 'Sleeping on time helps your body grow strong.',
    },
  },
  {
    id: 'friend-crying',
    emoji: ['💞', '😝', '🙉'],
    zh: {
      question: '你的好朋友哭了，你可以怎么做？',
      choices: ['陪着他，问他发生了什么事', '学他哭的样子取笑他', '走开，自己去玩'],
      why: '朋友难过的时候，陪伴是最好的礼物。',
    },
    en: {
      question: 'Your best friend is crying. What can you do?',
      choices: ['Stay with them and ask what happened', 'Copy their crying to tease them', 'Walk off and play by yourself'],
      why: 'Being there for a sad friend is the best gift.',
    },
  },
  {
    id: 'vegetables',
    emoji: ['🥦', '👇', '🍬'],
    zh: {
      question: '吃饭时有你不喜欢的青菜，你应该怎么做？',
      choices: ['试着吃一点，不浪费粮食', '偷偷把青菜扔到地上', '不吃饭，只吃糖果'],
      why: '粒粒皆辛苦，不挑食，不浪费。',
    },
    en: {
      question: 'Dinner has vegetables you don’t like. What should you do?',
      choices: ['Try a little and don’t waste food', 'Secretly drop them on the floor', 'Skip dinner and eat candy'],
      why: 'Growing food takes hard work, so we don’t waste it.',
    },
  },
  {
    id: 'tidy',
    emoji: ['🧺', '🧸', '🙈'],
    zh: {
      question: '玩完玩具以后，你应该怎么做？',
      choices: ['自己把玩具收拾好', '丢在地上等别人来收', '全部塞到床底下'],
      why: '自己的事情自己做，是负责任的好孩子。',
    },
    en: {
      question: 'You have finished playing with your toys. What should you do?',
      choices: ['Put them away yourself', 'Leave them for someone else to tidy', 'Shove them all under the bed'],
      why: 'Looking after your own things is being responsible.',
    },
  },
  {
    id: 'stickers',
    emoji: ['🙅', '🧥', '😭'],
    zh: {
      question: '你在商店看到喜欢的贴纸，可是没有带钱，你应该怎么做？',
      choices: ['放回去，不拿不属于自己的东西', '偷偷放进口袋', '躺在地上哭闹，非要大人买'],
      why: '没付钱就把东西拿走，是不对的。',
    },
    en: {
      question: 'You see stickers you love in a shop, but you have no money. What should you do?',
      choices: ['Put them back, because they are not yours', 'Slip them into your pocket', 'Lie on the floor and cry until someone buys them'],
      why: 'Taking things without paying is wrong.',
    },
  },
  {
    id: 'guest',
    emoji: ['🧱', '🙅', '🚪'],
    zh: {
      question: '小客人来家里玩，他想玩你的积木，你可以怎么做？',
      choices: ['和他一起搭积木', '说“都是我的，不许碰！”', '把他关在门外'],
      why: '热情招待客人，一起玩更快乐。',
    },
    en: {
      question: 'A young guest visits and wants to play with your blocks. What can you do?',
      choices: ['Build something together', 'Say “They’re all mine, don’t touch!”', 'Shut the door on them'],
      why: 'Welcoming guests and playing together is more fun.',
    },
  },
  {
    id: 'pencil',
    emoji: ['✏️', '🎒', '🦶'],
    zh: {
      question: '你发现同学的铅笔掉在地上，你应该怎么做？',
      choices: ['捡起来还给他', '偷偷放进自己的笔袋', '一脚把它踢开'],
      why: '物归原主，是诚实的表现。',
    },
    en: {
      question: 'You notice a classmate’s pencil on the floor. What should you do?',
      choices: ['Pick it up and give it back', 'Put it in your own pencil case', 'Kick it away'],
      why: 'Giving things back to their owner is honest.',
    },
  },
  {
    id: 'please',
    emoji: ['🙏', '😡', '🦶'],
    zh: {
      question: '你想请爸爸妈妈帮你拿东西，应该怎么说？',
      choices: ['“请帮我拿一下，谢谢！”', '大喊：“快给我拿来！”', '跺脚发脾气'],
      why: '“请”和“谢谢”是有魔法的礼貌用语。',
    },
    en: {
      question: 'You want your parents to pass you something. How should you ask?',
      choices: ['“Could you pass it to me, please?”', 'Yell “Give it to me now!”', 'Stomp and throw a tantrum'],
      why: '“Please” and “thank you” are magic words.',
    },
  },
  {
    id: 'bus-seat',
    emoji: ['💺', '😴', '🎒'],
    zh: {
      question: '坐公交车时，一位老奶奶上车了，却没有座位，你可以怎么做？',
      choices: ['把座位让给她', '假装睡着了', '把书包放在空座位上占座'],
      why: '尊老爱幼是一种美德。',
    },
    en: {
      question: 'On the bus, an elderly lady gets on and there are no seats left. What can you do?',
      choices: ['Offer her your seat', 'Pretend to be asleep', 'Put your bag on a seat to save it'],
      why: 'Offering your seat to older people is a good deed.',
    },
  },
  {
    id: 'window',
    emoji: ['📣', '👏', '🙈'],
    zh: {
      question: '你看到小弟弟想爬上窗台，你应该怎么做？',
      choices: ['马上叫大人来', '在旁边拍手给他加油', '不管他'],
      why: '发现危险的事，要马上告诉大人。',
    },
    en: {
      question: 'You see your little brother trying to climb onto the windowsill. What should you do?',
      choices: ['Call a grown-up right away', 'Clap and cheer him on', 'Ignore it'],
      why: 'When something looks dangerous, tell a grown-up right away.',
    },
  },

  // ---- statements: is this right or wrong? ----
  {
    id: 'cookies',
    judge: true,
    answer: true,
    zh: { question: '小明把自己的饼干分给没带零食的同学。', why: '分享是善良的表现。' },
    en: { question: 'Sam shares his cookies with a classmate who has no snack.', why: 'Sharing is kind.' },
  },
  {
    id: 'nest',
    judge: true,
    answer: false,
    zh: { question: '乐乐用树枝去捅树上的鸟窝。', why: '鸟窝是小鸟的家，不能去破坏它。' },
    en: { question: 'Leo pokes a bird’s nest with a stick.', why: 'A nest is a bird’s home. Leave it alone.' },
  },
  {
    id: 'homework-excuse',
    judge: true,
    answer: false,
    zh: { question: '丁丁没写作业，却跟老师说作业被小狗吃掉了。', why: '说谎是不对的，做错了要诚实地说出来。' },
    en: { question: 'Tom did not do his homework, so he tells the teacher the dog ate it.', why: 'Telling lies is wrong. Be honest, even when it’s hard.' },
  },
  {
    id: 'grandma-bags',
    judge: true,
    answer: true,
    zh: { question: '小美看到奶奶提着很重的菜，主动上前帮忙。', why: '主动帮助长辈，真贴心！' },
    en: { question: 'Mia sees Grandma carrying heavy shopping bags and offers to help.', why: 'Helping older people is thoughtful and kind.' },
  },
  {
    id: 'walls',
    judge: true,
    answer: false,
    zh: { question: '东东拿着蜡笔在墙上乱涂乱画。', why: '画画要画在纸上，也要爱护家里的东西。' },
    en: { question: 'Danny scribbles on the walls with crayons.', why: 'Draw on paper and take care of our home.' },
  },
  {
    id: 'sorry-foot',
    judge: true,
    answer: true,
    zh: { question: '朵朵不小心踩到别人的脚，马上说：“对不起！”', why: '不小心犯了错，马上道歉，真有礼貌。' },
    en: { question: 'Ava steps on someone’s foot by accident and says “Sorry!” right away.', why: 'Saying sorry quickly is polite and kind.' },
  },
  {
    id: 'cheat',
    judge: true,
    answer: false,
    zh: { question: '浩浩为了赢，偷偷在棋盘上多走了两步。', why: '游戏也要公平，作弊是不对的。' },
    en: { question: 'Max secretly moves two extra spaces on the board so he can win.', why: 'Games must be fair. Cheating is wrong.' },
  },
  {
    id: 'donate',
    judge: true,
    answer: true,
    zh: { question: '小雨把自己不玩的玩具，送给需要的小朋友。', why: '把爱心分享给别人，是一件好事。' },
    en: { question: 'Ruby gives the toys she no longer plays with to children who need them.', why: 'Giving to others is a good deed.' },
  },
  {
    id: 'ball-road',
    judge: true,
    answer: false,
    zh: { question: '皮球滚到马路上了，阳阳马上追着皮球跑到马路中间。', why: '马路上很危险，要请大人帮忙捡球。' },
    en: { question: 'Ben’s ball rolls into the road, so he runs straight after it.', why: 'Roads are dangerous. Ask a grown-up to get the ball.' },
  },
  {
    id: 'school-bag',
    judge: true,
    answer: true,
    zh: { question: '妮妮每天晚上都自己整理好书包。', why: '自己的事情自己做，真能干！' },
    en: { question: 'Nina packs her own school bag every evening.', why: 'Doing things for yourself is responsible.' },
  },
  {
    id: 'push',
    judge: true,
    answer: false,
    zh: { question: '壮壮生气了，就用力推了同学一下。', why: '生气的时候可以说出来，但是不能动手打人。' },
    en: { question: 'Omar gets angry and pushes a classmate hard.', why: 'When you’re angry, use your words, not your hands.' },
  },
  {
    id: 'litter',
    judge: true,
    answer: true,
    zh: { question: '贝贝看到地上有垃圾，捡起来扔进了垃圾桶。', why: '保护环境，人人有责。' },
    en: { question: 'Bella sees some litter and puts it in the bin.', why: 'Keeping our world clean is everyone’s job.' },
  },
  {
    id: 'secret',
    judge: true,
    answer: false,
    zh: { question: '小杰把好朋友的秘密告诉了全班，还哈哈大笑。', why: '要尊重朋友，不能取笑别人。' },
    en: { question: 'Jack tells the whole class his friend’s secret and laughs about it.', why: 'Respect your friends and never make fun of them.' },
  },
  {
    id: 'hat',
    judge: true,
    answer: true,
    zh: { question: '阿姨帮甜甜捡起了掉落的帽子，甜甜说：“谢谢阿姨！”', why: '别人帮助了我们，要说谢谢。' },
    en: { question: 'A lady picks up Zoe’s dropped hat, and Zoe says “Thank you!”', why: 'We say thank you when someone helps us.' },
  },
  {
    id: 'river',
    judge: true,
    answer: false,
    zh: { question: '可可一个人偷偷跑到河边去玩水。', why: '不能自己去水边玩，那样很危险。' },
    en: { question: 'Kai sneaks off to play by the river on his own.', why: 'Never go near water without a grown-up. It’s dangerous.' },
  },
  {
    id: 'plants',
    judge: true,
    answer: true,
    zh: { question: '皮皮每天给家里的小花浇水。', why: '照顾花草，也是爱护生命。' },
    en: { question: 'Pip waters the plants at home every day.', why: 'Looking after plants is caring for living things.' },
  },
  {
    id: 'purse',
    judge: true,
    answer: false,
    zh: { question: '小宇从妈妈的钱包里拿了钱，没有告诉妈妈。', why: '拿别人的钱要先问过，不问自取是不对的。' },
    en: { question: 'Raj takes money from his mom’s purse without asking her.', why: 'Always ask first. Taking without asking is wrong.' },
  },
  {
    id: 'teddy',
    judge: true,
    answer: true,
    zh: { question: '安安看到弟弟哭了，把自己的小熊借给他抱。', why: '关心家人，会让大家都开心。' },
    en: { question: 'Annie sees her little brother crying and lends him her teddy bear.', why: 'Caring for your family makes everyone happier.' },
  },
  {
    id: 'cinema',
    judge: true,
    answer: false,
    zh: { question: '冬冬在电影院里大声吵闹，还踢前面的座位。', why: '公共场所要安静，不打扰别人。' },
    en: { question: 'Luis shouts in the cinema and kicks the seat in front of him.', why: 'In public places we are quiet so others can enjoy it too.' },
  },
  {
    id: 'library-books',
    judge: true,
    answer: true,
    zh: { question: '米米借的图书，每次都按时还回去。', why: '借东西按时归还，是守信用的表现。' },
    en: { question: 'Hana always returns her library books on time.', why: 'Giving back what you borrow, on time, shows you can be trusted.' },
  },
  {
    id: 'waste',
    judge: true,
    answer: false,
    zh: { question: '小亮把吃不完的饭菜全部倒掉，还说“没关系”。', why: '珍惜粮食，吃多少就盛多少。' },
    en: { question: 'Ian throws away a big plate of food and says “Who cares?”', why: 'Don’t waste food. Take only what you can eat.' },
  },
  {
    id: 'stand-up',
    judge: true,
    answer: true,
    zh: { question: '思思看到有同学被笑话，走过去说：“我们一起玩吧！”', why: '勇敢地关心别人，真了不起！' },
    en: { question: 'Lily sees a classmate being teased and says, “Come and play with us!”', why: 'Standing up for others is brave and kind.' },
  },
  {
    id: 'copy',
    judge: true,
    answer: false,
    zh: { question: '豆豆把同学的作业拿来照着抄。', why: '作业要自己完成，抄作业是不诚实的。' },
    en: { question: 'Dan copies a classmate’s homework instead of doing his own.', why: 'Copying is not honest. Do your own work.' },
  },
  {
    id: 'make-bed',
    judge: true,
    answer: true,
    zh: { question: '园园早上起床后，自己把被子叠好。', why: '自己的事情自己做，真棒！' },
    en: { question: 'Rosa makes her own bed every morning.', why: 'Doing jobs for yourself is great!' },
  },
];

export const QUESTION_BY_ID = new Map(QUESTIONS.map((q) => [q.id, q]));

export function shuffled(list, random = Math.random) {
  const out = [...list];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}
