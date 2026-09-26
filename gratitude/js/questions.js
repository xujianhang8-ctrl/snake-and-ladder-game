// Heart questions for children aged about 5–9, asked when a token stops on a
// purple heart. Most are about gratitude (saying thank you, noticing what
// other people do for us, looking after what we have); the rest are about
// kindness, honesty, sharing and staying safe.
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
    id: 'gift',
    emoji: ['😊', '😒', '🤐'],
    zh: {
      question: '朋友送给你一个礼物，你应该说什么？',
      choices: ['“谢谢你！”', '“我不喜欢这个。”', '什么也不说，拿了就走'],
      why: '收到礼物，要真诚地说谢谢。',
    },
    en: {
      question: 'A friend gives you a present. What should you say?',
      choices: ['“Thank you!”', '“I don’t like this.”', 'Nothing, just take it and go'],
      why: 'Always say thank you for a present.',
    },
  },
  {
    id: 'dinner',
    emoji: ['😋', '🍕', '🏃'],
    zh: {
      question: '今天爸爸给你做了晚饭，你可以怎么做？',
      choices: ['说：“谢谢爸爸，真好吃！”', '抱怨说想吃披萨', '一声不吭，吃完就跑开'],
      why: '家人为我们做了很多事，说声谢谢，他们会很开心。',
    },
    en: {
      question: 'Dad cooked dinner for you tonight. What can you do?',
      choices: ['Say “Thank you, Dad, it’s yummy!”', 'Complain that you wanted pizza', 'Eat without a word and run off'],
      why: 'Our family does so much for us. A thank-you makes them happy.',
    },
  },
  {
    id: 'bus-driver',
    emoji: ['🚌', '🙄', '📢'],
    zh: {
      question: '下校车的时候，你可以对司机说什么？',
      choices: ['“谢谢您，再见！”', '看也不看就挤下车', '大喊：“开得太慢了！”'],
      why: '司机每天安全地送我们上学、回家，要谢谢他们。',
    },
    en: {
      question: 'You are getting off the school bus. What can you say to the driver?',
      choices: ['“Thank you, goodbye!”', 'Push past without looking', 'Shout “You drive too slowly!”'],
      why: 'Drivers get us to school and home safely every day. Thank them!',
    },
  },
  {
    id: 'teacher-help',
    emoji: ['📚', '🥱', '🏃'],
    zh: {
      question: '老师下课后留下来教你读书，你可以怎么做？',
      choices: ['谢谢老师，然后认真练习', '说：“真无聊！”', '趁老师不注意偷偷溜走'],
      why: '老师花时间帮助我们，我们要感谢老师，认真学习。',
    },
    en: {
      question: 'Your teacher stays after class to help you with reading. What can you do?',
      choices: ['Say thank you and keep practicing', 'Say “This is boring!”', 'Sneak off when they aren’t looking'],
      why: 'Teachers give us their time. We thank them by trying our best.',
    },
  },
  {
    id: 'scarf',
    emoji: ['💌', '🗄️', '😝'],
    zh: {
      question: '奶奶给你织了一条暖和的围巾，你可以怎样表达感谢？',
      choices: ['给奶奶做一张感谢卡', '把围巾塞进柜子，再也不管', '说：“围巾是小宝宝戴的。”'],
      why: '一张感谢卡，就能让奶奶知道你很珍惜她的心意。',
    },
    en: {
      question: 'Grandma knitted you a warm scarf. How can you show you are thankful?',
      choices: ['Make her a thank-you card', 'Stuff it in a cupboard and forget it', 'Say scarves are for babies'],
      why: 'A thank-you card shows Grandma you treasure her gift.',
    },
  },
  {
    id: 'lunch',
    emoji: ['🍱', '✊', '🤢'],
    zh: {
      question: '食堂阿姨把午饭递给你，你应该怎么做？',
      choices: ['微笑着说：“谢谢！”', '一句话不说，一把抓过来', '大声说：“好难吃！”'],
      why: '为我们做饭的人很辛苦，一句谢谢会让他们很开心。',
    },
    en: {
      question: 'The lunch server hands you your lunch. What should you do?',
      choices: ['Smile and say “Thank you!”', 'Grab it without a word', 'Say “Yuck!” loudly'],
      why: 'The people who make our food work hard. A thank-you brightens their day.',
    },
  },
  {
    id: 'small-gift',
    emoji: ['📖', '😭', '👇'],
    zh: {
      question: '你过生日想要一个大玩具，却收到了一本小书，你应该怎么做？',
      choices: ['说谢谢，开心地读这本书', '哭着说：“就这个？”', '把书扔在地上'],
      why: '礼物最珍贵的，是送礼物的人的心意，要说谢谢哦。',
    },
    en: {
      question: 'You wanted a big toy for your birthday, but you got a small book. What should you do?',
      choices: ['Say thank you and enjoy the book', 'Cry and say “Is that all?”', 'Throw the book on the floor'],
      why: 'The best part of a present is the love behind it. Say thank you!',
    },
  },
  {
    id: 'nurse',
    emoji: ['🩹', '🦵', '😡'],
    zh: {
      question: '护士给你打完针，贴好创可贴，你可以说什么？',
      choices: ['“谢谢您照顾我！”', '又踢又叫', '“我讨厌你！”'],
      why: '医生和护士帮助我们保持健康，要谢谢他们。',
    },
    en: {
      question: 'A nurse gives you a shot and puts on a bandage. What can you say?',
      choices: ['“Thank you for looking after me!”', 'Kick and scream', '“I hate you!”'],
      why: 'Doctors and nurses help keep us healthy. Thank them!',
    },
  },
  {
    id: 'help-home',
    emoji: ['🍽️', '📺', '🧩'],
    zh: {
      question: '妈妈忙了一整天，很累了。你可以怎样谢谢她？',
      choices: ['帮忙摆好碗筷', '继续看电视，大喊“我饿了！”', '把玩具扔得满地都是'],
      why: '帮家人做事，就是在说“谢谢”。',
    },
    en: {
      question: 'Mom has been busy all day and is tired. How can you thank her?',
      choices: ['Help set the table', 'Keep watching TV and shout “I’m hungry!”', 'Leave your toys all over the floor'],
      why: 'Helping out is a way of saying thank you.',
    },
  },
  {
    id: 'crayons',
    emoji: ['🖍️', '⏰', '🚶'],
    zh: {
      question: '你的蜡笔掉了一地，朋友帮你一起捡。你应该说什么？',
      choices: ['“谢谢你帮我！”', '“快点捡！”', '什么也不说，直接走开'],
      why: '别人帮了我们，要记得说谢谢。',
    },
    en: {
      question: 'You drop your crayons and a friend helps you pick them up. What do you say?',
      choices: ['“Thanks for helping me!”', '“Hurry up!”', 'Nothing, just walk away'],
      why: 'When someone helps us, we remember to say thanks.',
    },
  },
  {
    id: 'rainy-day',
    emoji: ['🏰', '😩', '😤'],
    zh: {
      question: '下雨了，不能去公园玩。哪一种是感恩的想法？',
      choices: ['“还好我可以在家用被子搭城堡！”', '“今天全都完蛋了！”', '一整天跺脚、大叫'],
      why: '找一找好的一面，心情就会变好。',
    },
    en: {
      question: 'It’s raining, so you can’t go to the park. Which is a thankful way to think?',
      choices: ['“At least I can build a blanket fort inside!”', '“The whole day is ruined!”', 'Stomp and yell all day'],
      why: 'Looking for the good side helps you feel better.',
    },
  },
  {
    id: 'tap',
    emoji: ['🚰', '🌊', '⚽'],
    zh: {
      question: '刷牙的时候，水龙头应该怎么样？',
      choices: ['先关上，要用水时再打开', '一直开着', '开着水跑去玩一会儿'],
      why: '干净的水很珍贵，要珍惜，不浪费。',
    },
    en: {
      question: 'While you brush your teeth, what should you do with the tap?',
      choices: ['Turn it off until you need water', 'Leave it running the whole time', 'Leave it on and go play'],
      why: 'Clean water is precious. Be thankful for it and don’t waste it.',
    },
  },
  {
    id: 'vegetables',
    emoji: ['🥦', '👇', '🍬'],
    zh: {
      question: '吃饭时有你不喜欢的青菜，你应该怎么做？',
      choices: ['试着吃一点，不浪费粮食', '偷偷把青菜扔到地上', '不吃饭，只吃糖果'],
      why: '农民种菜很辛苦，要感谢他们，珍惜食物。',
    },
    en: {
      question: 'Dinner has vegetables you don’t like. What should you do?',
      choices: ['Try a little and don’t waste food', 'Secretly drop them on the floor', 'Skip dinner and eat candy'],
      why: 'Farmers work hard to grow our food. Be thankful for it and don’t waste it.',
    },
  },
  {
    id: 'new-shoes',
    emoji: ['👟', '😒', '💦'],
    zh: {
      question: '爸爸妈妈给你买了新鞋，你可以怎么做？',
      choices: ['说谢谢，并好好爱护新鞋', '嫌颜色不好看，噘着嘴生气', '故意踩进水坑里'],
      why: '爱惜别人给我们的东西，也是一种感谢。',
    },
    en: {
      question: 'Your parents buy you new shoes. What can you do?',
      choices: ['Say thank you and take good care of them', 'Sulk because you wanted a different color', 'Stomp in puddles on purpose'],
      why: 'Taking care of what we are given is a way of saying thanks.',
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
    id: 'blocks',
    emoji: ['🧱', '🏃', '👉'],
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
      why: '不乱扔垃圾，爱护我们的环境。香蕉皮还会让人滑倒呢！',
    },
    en: {
      question: 'You finish a banana. What do you do with the peel?',
      choices: ['Put it in the bin', 'Drop it on the path', 'Throw it out of the car window'],
      why: 'Don’t litter. A banana peel on the ground can make someone slip!',
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
    id: 'please',
    emoji: ['💬', '😡', '🦶'],
    zh: {
      question: '你想请爸爸妈妈帮你拿东西，应该怎么说？',
      choices: ['“请帮我拿一下，谢谢！”', '大喊：“快给我拿来！”', '跺脚发脾气'],
      why: '“请”和“谢谢”是有魔法的礼貌用语。',
    },
    en: {
      question: 'You want your parents to pass you something. How should you ask?',
      choices: ['“Could you pass it to me, please? Thank you!”', 'Yell “Give it to me now!”', 'Stomp and throw a tantrum'],
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
      why: 'Offering your seat to older people is a kind thing to do.',
    },
  },
  {
    id: 'package',
    emoji: ['📦', '🚪', '⌛'],
    zh: {
      question: '快递员把包裹送到你家门口，你可以说什么？',
      choices: ['“谢谢您送过来！”', '一把拿过来，砰地关上门', '抱怨送得太慢'],
      why: '每一个包裹，都有人辛辛苦苦送了一路。',
    },
    en: {
      question: 'A delivery driver brings a package to your door. What can you say?',
      choices: ['“Thank you for bringing it!”', 'Grab it and slam the door', 'Complain that it took too long'],
      why: 'Someone traveled a long way to bring it. Say thanks!',
    },
  },
  {
    id: 'three-good-things',
    emoji: ['🌟', '🌧️', '😠'],
    zh: {
      question: '睡觉前，怎样结束这一天最好？',
      choices: ['想一想今天值得感谢的三件事', '只想不开心的事', '抱怨所有的事情'],
      why: '想想值得感谢的事，心里暖暖的，睡得也更香。',
    },
    en: {
      question: 'At bedtime, what is a good way to end the day?',
      choices: ['Think of three things you are thankful for', 'Think only about what went wrong', 'Complain about everything'],
      why: 'Thinking of good things warms your heart and helps you sleep well.',
    },
  },
  {
    id: 'cleaner',
    emoji: ['🧹', '🏃', '🍬'],
    zh: {
      question: '你看到清洁工正在拖走廊，你可以怎么做？',
      choices: ['说声谢谢，绕开湿的地方走', '从湿地板上跑过去', '把糖纸扔在地上'],
      why: '清洁工让学校干干净净，我们要感谢他们，也要爱护环境。',
    },
    en: {
      question: 'You see the school cleaner mopping the hallway. What can you do?',
      choices: ['Say thank you and walk around the wet part', 'Run across the wet floor', 'Drop your candy wrapper on the floor'],
      why: 'Cleaners keep our school tidy. Thank them and help keep it clean.',
    },
  },
  {
    id: 'shoelaces',
    emoji: ['🎀', '👎', '🏃'],
    zh: {
      question: '姐姐帮你系鞋带，你可以怎么做？',
      choices: ['说谢谢，下次也帮帮她', '说：“你系得不对！”', '一句话不说就跑掉'],
      why: '互相帮助、互相感谢，家人会更亲密。',
    },
    en: {
      question: 'Your big sister helps you tie your shoelaces. What can you do?',
      choices: ['Say thank you, and help her next time', 'Say “You did it wrong!”', 'Run off without a word'],
      why: 'Helping and thanking each other brings a family closer.',
    },
  },
  {
    id: 'neighbor',
    emoji: ['🎨', '🍪', '😖'],
    zh: {
      question: '邻居给你家送来了饼干，你可以怎么做？',
      choices: ['说谢谢，再给邻居画一幅画', '全部吃掉，还把盘子藏起来', '说：“我们不喜欢吃这个。”'],
      why: '别人对我们好，我们也可以用小小的心意回报。',
    },
    en: {
      question: 'Your neighbor brings cookies for your family. What could you do?',
      choices: ['Say thank you and draw them a picture', 'Eat them all and hide the plate', 'Say “We don’t like these”'],
      why: 'When someone is kind to us, we can be kind back.',
    },
  },
  {
    id: 'coach',
    emoji: ['🏊', '🚶', '😏'],
    zh: {
      question: '游泳课结束了，教练说：“今天表现很棒！”你可以说什么？',
      choices: ['“谢谢教练！”', '一句话不说就走开', '“这我早就知道了。”'],
      why: '有人鼓励你，要谢谢他们哦。',
    },
    en: {
      question: 'After swimming class, your coach says “Great job today!” What can you say?',
      choices: ['“Thank you, Coach!”', 'Walk off without a word', '“I already knew that.”'],
      why: 'When someone cheers you on, thank them.',
    },
  },

  // ---- statements: is this right or wrong? ----
  {
    id: 'hat',
    judge: true,
    answer: true,
    zh: { question: '阿姨帮甜甜捡起了掉落的帽子，甜甜说：“谢谢阿姨！”', why: '别人帮助了我们，要说谢谢。' },
    en: { question: 'A lady picks up Zoe’s dropped hat, and Zoe says “Thank you!”', why: 'We say thank you when someone helps us.' },
  },
  {
    id: 'cookies',
    judge: true,
    answer: true,
    zh: { question: '小明把自己的饼干分给没带零食的同学。', why: '分享是善良的表现。' },
    en: { question: 'Sam shares his cookies with a classmate who has no snack.', why: 'Sharing is kind.' },
  },
  {
    id: 'teacher-card',
    judge: true,
    answer: true,
    zh: { question: '学期结束时，小美给老师写了一张感谢卡。', why: '用卡片说谢谢，老师一定很感动。' },
    en: { question: 'At the end of the school year, Mia writes her teacher a thank-you card.', why: 'A thank-you card can make a teacher’s day.' },
  },
  {
    id: 'grumble-gift',
    judge: true,
    answer: false,
    zh: { question: '乐乐打开姑姑送的礼物，说：“哼，我想要更好的。”', why: '不管收到什么礼物，都要谢谢送礼物的人。' },
    en: { question: 'Finn opens a present from his aunt and says, “Ugh, I wanted something better.”', why: 'Whatever the present, thank the person who gave it.' },
  },
  {
    id: 'waste',
    judge: true,
    answer: false,
    zh: { question: '小亮把吃不完的饭菜全部倒掉，还说“没关系”。', why: '感谢每一份食物，吃多少就盛多少。' },
    en: { question: 'Ian throws away a big plate of food and says “Who cares?”', why: 'Be thankful for your food: take only what you can eat.' },
  },
  {
    id: 'plants',
    judge: true,
    answer: true,
    zh: { question: '皮皮每天给家里的小花浇水。', why: '照顾花草，也是爱护生命。' },
    en: { question: 'Pip waters the plants at home every day.', why: 'Looking after plants is caring for living things.' },
  },
  {
    id: 'story',
    judge: true,
    answer: true,
    zh: { question: '朵朵谢谢爷爷给她讲睡前故事。', why: '家人的陪伴是很珍贵的礼物。' },
    en: { question: 'Ava thanks Grandpa for reading her a bedtime story.', why: 'Time with family is a precious gift.' },
  },
  {
    id: 'no-thanks',
    judge: true,
    answer: false,
    zh: { question: '好朋友帮浩浩提很重的书包，浩浩一句谢谢也没说。', why: '别人帮了忙，要记得说谢谢。' },
    en: { question: 'Max’s friend helps him carry his heavy bag, but Max doesn’t say thank you.', why: 'When someone helps, remember to say thank you.' },
  },
  {
    id: 'donate',
    judge: true,
    answer: true,
    zh: { question: '小雨把自己不玩的玩具，送给需要的小朋友。', why: '把自己有的分享给别人，也是一种感恩。' },
    en: { question: 'Ruby gives the toys she no longer plays with to children who need them.', why: 'Sharing what we have is a lovely way to show we are thankful for it.' },
  },
  {
    id: 'litter',
    judge: true,
    answer: true,
    zh: { question: '贝贝看到地上有垃圾，捡起来扔进了垃圾桶。', why: '保护环境，人人有责。' },
    en: { question: 'Bella sees some litter and puts it in the bin.', why: 'Keeping our world clean is everyone’s job.' },
  },
  {
    id: 'homework-excuse',
    judge: true,
    answer: false,
    zh: { question: '丁丁没写作业，却跟老师说作业被小狗吃掉了。', why: '说谎是不对的，做错了要诚实地说出来。' },
    en: { question: 'Tom did not do his homework, so he tells the teacher the dog ate it.', why: 'Telling lies is wrong. Be honest, even when it’s hard.' },
  },
  {
    id: 'teddy',
    judge: true,
    answer: true,
    zh: { question: '安安看到弟弟哭了，把自己的小熊借给他抱。', why: '关心家人，会让大家都开心。' },
    en: { question: 'Annie sees her little brother crying and lends him her teddy bear.', why: 'Caring for your family makes everyone happier.' },
  },
  {
    id: 'push',
    judge: true,
    answer: false,
    zh: { question: '壮壮生气了，就用力推了同学一下。', why: '生气的时候可以说出来，但是不能动手打人。' },
    en: { question: 'Omar gets angry and pushes a classmate hard.', why: 'When you’re angry, use your words, not your hands.' },
  },
  {
    id: 'library-books',
    judge: true,
    answer: true,
    zh: { question: '米米借的图书，每次都按时还回去。', why: '借东西按时归还，是守信用的表现。' },
    en: { question: 'Hana always returns her library books on time.', why: 'Giving back what you borrow, on time, shows you can be trusted.' },
  },
  {
    id: 'nest',
    judge: true,
    answer: false,
    zh: { question: '东东用树枝去捅树上的鸟窝。', why: '鸟窝是小鸟的家，不能去破坏它。' },
    en: { question: 'Leo pokes a bird’s nest with a stick.', why: 'A nest is a bird’s home. Leave it alone.' },
  },
  {
    id: 'cheat',
    judge: true,
    answer: false,
    zh: { question: '阳阳为了赢，偷偷在棋盘上多走了两步。', why: '游戏也要公平，作弊是不对的。' },
    en: { question: 'Ben secretly moves two extra spaces on the board so he can win.', why: 'Games must be fair. Cheating is wrong.' },
  },
  {
    id: 'dishes',
    judge: true,
    answer: true,
    zh: { question: '可可帮忙洗碗，谢谢妈妈做的晚饭。', why: '用行动说谢谢，真棒！' },
    en: { question: 'Kai helps wash the dishes to thank Mom for dinner.', why: 'Saying thanks with actions is great!' },
  },
  {
    id: 'server',
    judge: true,
    answer: false,
    zh: { question: '在餐厅里，小杰对服务员大喊：“快点！”', why: '对为我们服务的人要有礼貌，还要说谢谢。' },
    en: { question: 'At a restaurant, Jack shouts “Hurry up!” at the server.', why: 'Be polite to people who serve us, and say thank you.' },
  },
  {
    id: 'thank-jar',
    judge: true,
    answer: true,
    zh: { question: '妮妮每天晚上都把一件值得感谢的事写下来，放进“感恩罐”。', why: '记下美好的事，每天都会更快乐。' },
    en: {
      question: 'Every evening, Nina writes down one thing she is thankful for and puts it in her “thank-you jar.”',
      why: 'Noticing good things makes every day happier.',
    },
  },
  {
    id: 'break-toy',
    judge: true,
    answer: false,
    zh: { question: '豆豆故意把新玩具弄坏，因为他想要更新的。', why: '要感恩、珍惜自己拥有的东西。' },
    en: { question: 'Dan breaks his new toy on purpose because he wants an even newer one.', why: 'Be thankful for what you have and take good care of it.' },
  },
  {
    id: 'secret',
    judge: true,
    answer: false,
    zh: { question: '小宇把好朋友的秘密告诉了全班，还哈哈大笑。', why: '要尊重朋友，不能取笑别人。' },
    en: { question: 'Rosa tells the whole class her friend’s secret and laughs about it.', why: 'Respect your friends and never make fun of them.' },
  },
  {
    id: 'stand-up',
    judge: true,
    answer: true,
    zh: { question: '思思看到有同学被笑话，走过去说：“我们一起玩吧！”', why: '勇敢地关心别人，真了不起！' },
    en: { question: 'Lily sees a classmate being teased and says, “Come and play with us!”', why: 'Standing up for others is brave and kind.' },
  },
  {
    id: 'purse',
    judge: true,
    answer: false,
    zh: { question: '冬冬从妈妈的钱包里拿了钱，没有告诉妈妈。', why: '拿别人的钱要先问过，不问自取是不对的。' },
    en: { question: 'Raj takes money from his mom’s purse without asking her.', why: 'Always ask first. Taking without asking is wrong.' },
  },
  {
    id: 'river',
    judge: true,
    answer: false,
    zh: { question: '园园一个人偷偷跑到河边去玩水。', why: '不能自己去水边玩，那样很危险。' },
    en: { question: 'Eli sneaks off to play by the river on his own.', why: 'Never go near water without a grown-up. It’s dangerous.' },
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
