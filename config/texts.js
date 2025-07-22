// config/texts.js
// ES Module with all bot text templates and voice file identifiers

// Приветственное сообщение
export const WELCOME = `
👋 <b>Привет, солнечная!</b>
Я — Мария из <i>Speak & Shine</i>.

Вот твой мини‑пак: <b>Survival Pack 🗣️</b>.
Выбери ситуацию — и я пришлю список фраз с аудио!
`.trim();

// Кнопки выбора пакета
export const SURVIVAL_MENU = [
  [
    { text: '🩺 Доктор', callback_data: 'doc' },
    { text: '🏪 Магазин', callback_data: 'shop' }
  ],
  [
    { text: '🏫 Школа', callback_data: 'school' },
    { text: '🏦 Банк', callback_data: 'bank' }
  ],
  [ { text: '☕ Small Talk', callback_data: 'small' } ]
];

// Фразы + подписи (HTML)
export const PHRASES = {
  doc: {
    caption: `🩺 <b>Фразы для визита к врачу</b>

1️⃣ <b>I have an appointment at 10.</b>
   — У меня запись на 10.

2️⃣ <b>I don’t feel well.</b>
   — Мне нехорошо.

3️⃣ <b>My throat hurts and I have a fever.</b>
   — У меня болит горло и температура.

4️⃣ <b>It started three days ago.</b>
   — Началось три дня назад.

5️⃣ <b>Is this covered by insurance?</b>
   — Это покрывает страховка?

6️⃣ <b>I already took Tylenol, but it didn’t help.</b>
   — Я уже пила Тайленол, но не помогло.

7️⃣ <b>Do I need a note for school/work?</b>
   — Нужна справка для школы/работы?

<i>📢 Произноси вслух, повторяй за мной!</i>`,
    voiceFile: 'voices/doc.ogg'
  },
  shop: {
    caption: `🏪 <b>Фразы для магазина</b>

1️⃣ <b>Excuse me, can you help me find eggs?</b>
   — Извините, вы можете помочь найти яйца?

2️⃣ <b>Do you have this in a bigger/smaller size?</b>
   — У вас есть это побольше/поменьше?

3️⃣ <b>How much is this?</b>
   — Сколько это стоит?

4️⃣ <b>Where is the fitting room?</b>
   — Где примерочная?

5️⃣ <b>I’d like to return this — it didn’t fit.</b>
   — Я хочу вернуть это — не подошло.

6️⃣ <b>Can I return this? It’s spoiled.</b>
   — Можно вернуть? Оно испорчено.

7️⃣ <b>Are there any discounts on this?</b>
   — На это есть скидка?

<i>📢 Произноси вслух, повторяй за мной!</i>`,
    voiceFile: 'voices/shop.ogg'
  },
  school: {
    caption: `🏫 <b>Фразы для школы/родителей</b>

1️⃣ <b>Hi, I’m Anna’s mom.</b>
   — Здравствуйте, я мама Анны.

2️⃣ <b>Can I ask about her homework?</b>
   — Можно спросить про домашку?

3️⃣ <b>Is everything okay in class?</b>
   — Всё ли хорошо в классе?

4️⃣ <b>Is there anything we can do at home to help her?</b>
   — Мы можем помочь дома?

5️⃣ <b>I think she needs extra help with reading.</b>
   — Думаю, ей нужна помощь по чтению.

6️⃣ <b>Can we talk again next week?</b>
   — Можем поговорить ещё раз?

7️⃣ <b>Thank you for your time and care.</b>
   — Спасибо за ваше время и заботу.

<i>📢 Произноси вслух, повторяй за мной!</i>`,
    voiceFile: 'voices/school.ogg'
  },
  bank: {
    caption: `🏦 <b>Фразы для банка</b>

1️⃣ <b>I have a question about my account.</b>
   — У меня вопрос по счёту.

2️⃣ <b>I saw a strange charge here.</b>
   — Здесь странное списание.

3️⃣ <b>Can you explain this letter to me?</b>
   — Объясните это письмо.

4️⃣ <b>I want to send money to another account.</b>
   — Хочу перевести деньги.

5️⃣ <b>What documents do I need to bring?</b>
   — Какие документы взять?

6️⃣ <b>I need to order a new card. I lost mine.</b>
   — Мне нужна новая карта.

7️⃣ <b>Can I open a joint account with my husband?</b>
   — Можно открыть совместный счёт?

<i>📢 Произноси вслух, повторяй за мной!</i>`,
    voiceFile: 'voices/bank.ogg'
  },
  small: {
    caption: `☕ <b>Фразы для Small Talk</b>

1️⃣ <b>Hi! I like your bag/dress/jacket.</b>
   — Привет! Мне нравится ваша сумка/платье/куртка.

2️⃣ <b>This weather is so nice today!</b>
   — Сегодня такая приятная погода!

3️⃣ <b>It’s really hot today, isn’t it?</b>
   — Сегодня прям жарко, правда?

4️⃣ <b>I see you here often!</b>
   — Я вас часто здесь вижу!

5️⃣ <b>Do you live nearby?</b>
   — Вы рядом живёте?

6️⃣ <b>Your kids are so cute! How old are they?</b>
   — Ваши дети такие милые! Сколько им лет?

7️⃣ <b>I’m Maria, by the way. What’s your name?</b>
   — Кстати, я Мария. А как вас зовут?

<i>📢 Произноси вслух, повторяй за мной!</i>`,
    voiceFile: 'voices/small.ogg'
  }
};

// Сообщение с инструкциями после аудио
export const AFTER_FILE = `
📬 <b>Готово!</b>
Попробуй записать <b>3 фразы</b> голосом (10–15 с) и отправь мне. Я дам обратную связь! 💛
`.trim();

// Вопросник (квиз)
export const QUIZ = {
  q1: {
    text: '<b>1/4.</b> Зачем тебе английский?',
    buttons: [
      { text: '🏡 Жизнь',        callback_data: 'quiz_q1:life' },
      { text: '💼 Работа',       callback_data: 'quiz_q1:work' },
      { text: '🧑‍🎓 Учёба',      callback_data: 'quiz_q1:school' },
      { text: '😌 Уверенность',   callback_data: 'quiz_q1:confidence' }
    ]
  },
  q2: {
    text: '<b>2/4.</b> Что тебя тормозит?',
    buttons: [
      { text: '🙈 Слова',     callback_data: 'quiz_q2:words' },
      { text: '😳 Страх',      callback_data: 'quiz_q2:fear' },
      { text: '🙊 Молчу',      callback_data: 'quiz_q2:silence' },
      { text: '📚 Грамматика', callback_data: 'quiz_q2:grammar' }
    ]
  },
  q3: {
    text: '<b>3/4.</b> Срочность (1–10)',
    buttons: Array.from({ length: 10 }, (_, i) => ({
      text: String(i + 1),
      callback_data: `quiz_q3:${i + 1}`
    }))
  },
  q4: {
    text: '<b>4/4.</b> Сколько минут в день?',
    buttons: [
      { text: '5 мин',  callback_data: 'quiz_q4:5' },
      { text: '15 мин', callback_data: 'quiz_q4:15' },
      { text: '30+ мин',callback_data: 'quiz_q4:30' }
    ]
  }
};

// Пичи после квиза
export const TIER23_PITCH = `
🔥 <b>Отличный драйв!</b> {urgency}/10
При <b>{time} мин</b> в день живые занятия дадут суперрезультат.

📅 Хочешь Zoom? Нажми кнопку ниже:
`.trim();

export const TIER1_PITCH = `
⏱ <b>Умный план 10 мин в день.</b>
Скачай пробную <i>Week-Map</i> и посмотри первый урок.
`.trim();

// Ссылки
export const CALENDLY_URL       = 'https://calendly.com/finnomaryia/english-with-ease-confidence-first-step';
export const TIER1_WEEKMAP_URL = 'https://your.site/week-map.pdf';
export const TIER1_PAYMENT_URL = 'https://your.site/pay';
