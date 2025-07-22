// config/texts.js
// ES Module with all bot text templates and voice file paths

export const WELCOME = `
👋 <b>Привет, солнечная!</b><br>
Я — Мария из <i>Speak & Shine</i>.<br><br>
Вот твой мини‑пак: <b>Survival Pack 🗣️</b>.<br>
Выбери ситуацию — пришлю 7 фраз + аудио:
`.trim();

export const SURVIVAL_MENU = [
  [
    { text: '🩺 Доктор', callback_data: 'doc' },
    { text: '🏪 Магазин', callback_data: 'shop' }
  ],
  [
    { text: '🏫 Школа', callback_data: 'school' },
    { text: '🏦 Банк', callback_data: 'bank' }
  ],
  [ { text: '☕ Small Talk', callback_data: 'small' } ]
];

export const PHRASES = {
  small: {
    caption: `🤝 <b>7 фраз для Small Talk</b><br><br>
1. Hi! I like your bag/dress/jacket — Привет! Мне нравится ваша сумка/платье/куртка.<br>
2. This weather is so nice today! — Сегодня такая приятная погода!<br>
3. It’s really hot today, isn’t it? — Сегодня прям жарко, правда?<br>
4. I see you here often! — Я вас часто здесь вижу!<br>
5. Do you live nearby? — Вы рядом живёте?<br>
6. Your kids are so cute! How old are they? — Ваши дети такие милые! Сколько им лет?<br>
7. I’m Maria, by the way. What’s your name? — Кстати, я Мария. А как вас зовут?<br><br>
<i>Произношение:</i> пауза после каждой фразы — повторяй за мной!`,
    voiceFile: 'voices/small.ogg'
  },
  doc: {
    caption: `🩺 <b>Фразы для врача</b><br><br>
1. I have an appointment at 10. — У меня запись на 10.<br>
2. I don’t feel well. — Мне нехорошо.<br>
3. My throat hurts and I have a fever. — У меня болит горло и температура.<br>
4. It started three days ago. — Началось три дня назад.<br>
5. Is this covered by insurance? — Это покрывает страховка?<br>
6. I already took Tylenol, but it didn’t help. — Я уже пила Тайленол, но не помогло.<br>
7. Do I need a note for school/work? — Нужна справка для школы/работы?<br><br>
<i>Произношение:</i> повторяй за мной.`,
    voiceFile: 'voices/doc.ogg'
  },
  shop: {
    caption: `🛍 <b>Фразы для магазина</b><br><br>
1. Excuse me, can you help me find eggs? — Извините, вы можете помочь найти яйца?<br>
2. Do you have this in a bigger/smaller size? — У вас есть это побольше/поменьше?<br>
3. How much is this? — Сколько это стоит?<br>
4. Where is the fitting room? — Где примерочная?<br>
5. I’d like to return this — it didn’t fit. — Я хочу вернуть это — не подошло.<br>
6. Can I return this? It’s spoiled. — Можно вернуть? Оно испорчено.<br>
7. Are there any discounts on this? — На это есть скидка?<br><br>
<i>Произношение:</i> повторяй за мной.`,
    voiceFile: 'voices/shop.ogg'
  },
  school: {
    caption: `🎒 <b>Фразы для школы</b><br><br>
1. Hi, I’m Anna’s mom. — Здравствуйте, я мама Анны.<br>
2. Can I ask about her homework? — Можно спросить про домашку?<br>
3. Is everything okay in class? — Всё ли хорошо в классе?<br>
4. Is there anything we can do at home to help her? — Мы можем помочь дома?<br>
5. I think she needs extra help with reading. — Думаю, ей нужна помощь по чтению.<br>
6. Can we talk again next week? — Можем поговорить ещё раз?<br>
7. Thank you for your time and care. — Спасибо за ваше время и заботу.<br><br>
<i>Произношение:</i> повторяй за мной.`,
    voiceFile: 'voices/school.ogg'
  },
  bank: {
    caption: `🏦 <b>Фразы для банка</b><br><br>
1. I have a question about my account. — У меня вопрос по счёту.<br>
2. I saw a strange charge here. — Здесь странное списание.<br>
3. Can you explain this letter to me? — Объясните это письмо.<br>
4. I want to send money to another account. — Хочу перевести деньги.<br>
5. What documents do I need to bring? — Какие документы взять?<br>
6. I need to order a new card. I lost mine. — Мне нужна новая карта.<br>
7. Can I open a joint account with my husband? — Можно открыть совместный счёт?<br><br>
<i>Произношение:</i> повторяй за мной.`,
    voiceFile: 'voices/bank.ogg'
  }
};

export const AFTER_FILE = `
✅ <b>Готово!</b><br>
Выбери <b>3 фразы</b>, запиши их голосом (10–15 с), и я пришлю фидбек. 💛
`.trim();

export const QUIZ = {
  q1: {
    text: '<b>1/4.</b> Зачем тебе английский?',
    buttons: [
      { text: '🏡 Жизнь', callback_data: 'quiz_q1:life' },
      { text: '💼 Работа', callback_data: 'quiz_q1:work' },
      { text: '🧑‍🎓 Учёба', callback_data: 'quiz_q1:school' },
      { text: '😌 Уверенность', callback_data: 'quiz_q1:confidence' }
    ]
  },
  q2: {
    text: '<b>2/4.</b> Что тормозит?',
    buttons: [
      { text: '🙈 Слова', callback_data: 'quiz_q2:words' },
      { text: '😳 Страх', callback_data: 'quiz_q2:fear' },
      { text: '🙊 Молчу', callback_data: 'quiz_q2:silence' },
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
    text: '<b>4/4.</b> Время в день',
    buttons: [
      { text: '5 мин', callback_data: 'quiz_q4:5' },
      { text: '15 мин', callback_data: 'quiz_q4:15' },
      { text: '30 мин+', callback_data: 'quiz_q4:30' }
    ]
  }
};

export const TIER23_PITCH = `
🔥 <b>Супер‑драйв!</b> {urgency}/10<br>
При <b>{time} мин</b> в день живые занятия дадут максимальный рывок.<br><br>
📅 Хочешь Zoom? Нажми кнопку ниже.
`.trim();

export const TIER1_PITCH = `
⏱ <b>10 мин в день</b> — умный план для занятых.<br>
Скачай пробную <i>Week‑Map</i> и смотри первый урок.
`.trim();

export const CALENDLY_URL = 'https://calendly.com/finnomaryia/english-with-ease-confidence-first-step';
export const TIER1_WEEKMAP_URL = 'https://your.site/week-map.pdf';
export const TIER1_PAYMENT_URL = 'https://your.site/pay';
