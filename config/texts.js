// config/texts.js
// ES Module with all bot text templates and voice file paths

export const WELCOME =
  'Привет, солнечная! ☀️ Я <b>Мария</b> из <i>Speak & Shine</i>.' +
  '\n\nВот твой мини‑пак <b>Survival Pack 🗣️</b>.' +
  '\nВыбери, какая ситуация жмёт сильнее всего — пришлю <b>7 нужных фраз + аудио</b> прямо здесь.';

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

// Seven phrases + corresponding voice file for each pack
export const PHRASES = {
  small: {
    caption: `🤝 7 фраз для знакомства и лёгкой беседы 🌷🌷🌷

Поехали? 😉

1. Hi! I like your bag / dress / jacket.
→ Привет! Мне нравится ваша сумка / платье / куртка.
(дружелюбный комплимент, можно заменить предмет)

2. This weather is so nice today!
→ Сегодня такая приятная погода!
(универсальный старт для беседы)

3. It’s really hot today, isn’t it?
→ Сегодня прям жарко, правда?
(более разговорный вариант)

4. I see you here often!
→ Я вас часто здесь вижу!
(фраза для "знакомого незнакомца")

5. Do you live nearby?
→ Вы рядом живёте?
(естественный вопрос после предыдущей)

6. Your kids are so cute! How old are they?
→ Такие милые дети! Сколько им лет?
(часто используемая фраза у школы/парка)

7. I’m Maria, by the way. And what is your name?
→ Кстати, я Мария. А как вас зовут?
(мягкий способ представиться)

Произношение: пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voiceFile: 'voices/small.ogg'
  },
  doc: {
    caption: `🩺 Фразы для визита к врачу, страховки, жалоб и объяснений

1. I have an appointment at 10.
→ У меня запись на 10.
(чтобы сообщить о визите)

2. I don’t feel well.
→ Мне нехорошо.
(если не знаешь, как описать всё)

3. My throat hurts and I have a fever.
→ У меня болит горло и температура.
(просто и по делу)

4. It started three days ago.
→ Началось три дня назад.
(четко по срокам)

5. Is this covered by insurance?
→ Это покрывает страховка?
(важный вопрос перед анализами)

6. I already took Tylenol, but it didn’t help.
→ Я уже пила Тайленол, но не помогло.
(доктору важно знать)

7. Do I need a note for school/work?
→ Нужна справка для школы/работы?
(не забыть в конце приёма)

Произношение: пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voiceFile: 'voices/doc.ogg'
  },
  shop: {
    caption: `🛍 Фразы для магазинов, примерки, возврата, вопросов

1. Excuse me, can you please help me find eggs?
→ Извините, вы можете помочь мне найти яйца?
(реальный вопрос, с которого всё начинается)

2. Do you have this in a bigger/ smaller size?
→ У вас есть это побольше или поменьше?
(для одежды/еды)

3. How much is this?
→ Сколько это стоит?
(вопрос о цене)

4. Where is the fitting room?
→ Где примерочная?
(важно в магазинах одежды)

5. I’d like to return this — it didn’t fit.
→ Хочу вернуть это — не подошло.
(для одежды)

6. Can I return this? It’s spoiled.
→ Можно вернуть это? Оно испорчено.
(для продуктов)

7. Are there any discounts on this?
→ На это есть скидка?
(универсальный вопрос про акции)

Произношение: пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voiceFile: 'voices/shop.ogg'
  },
  school: {
    caption: `🎒 Фразы для учительницы, домашки, поддержки ребёнка

1. Hi, I’m Anna’s mom.
→ Здравствуйте, я мама Анны.
(начинаем знакомство)

2. Can I ask about her homework?
→ Можно спросить про домашку?
(если ребёнок не помнит)

3. Is everything okay in class?
→ Всё ли хорошо в классе?
(вежливо интересуемся)

4. Is there anything we can do at home to help her?
→ Мы можем помочь ей дома?
(мягко показать участие)

5. I think she needs extra help with reading.
→ Думаю, ей нужна помощь по чтению.
(для поддержки прогресса)

6. Can we talk again next week?
→ Можем поговорить ещё раз на следующей неделе?
(уважительное предложение)

7. Thank you for your time and care.
→ Спасибо за ваше время и заботу.
(завершаем тепло)

Произношение: пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voiceFile: 'voices/school.ogg'
  },
  bank: {
    caption: `🏦 Фразы для звонков, переводов, ошибок и писем

1. I have a question about my account.
→ У меня вопрос по счёту.
(начало разговора)

2. I saw a strange charge here.
→ Здесь странное списание.
(если списали деньги непонятно за что)

3. Can you explain this letter to me?
→ Объясните это письмо.
(письма от банка пугают)

4. I want to send money to another account.
→ Хочу перевести деньги на другой счёт.
(частая задача)

5. What documents do I need to bring?
→ Какие документы нужны?
(при визите в отделение)

6. I need to order a new card. I lost mine.
→ Мне нужна новая карта. Я потеряла свою.
(для звонка или визита)

7. Can I open a joint account with my husband?
→ Можно открыть совместный счёт с мужем?
(семейные вопросы)

Произношение: пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voiceFile: 'voices/bank.ogg'
  }
};

export const AFTER_FILE = `Готово!  
Теперь выбери *ЛЮБЫЕ 3 фразы* из пакета, запиши их голосом (10–15 с) —
и я пришлю тебе личную обратную связь. 💛`;

export const QUIZ = {
  q1: {
    text: '1/4. Зачем тебе английский?',
    buttons: [
      { text: '🏡 Жизнь', callback_data: 'quiz_q1:life' },
      { text: '💼 Работа', callback_data: 'quiz_q1:work' },
      { text: '🏫 Школа/дети', callback_data: 'quiz_q1:kids' },
      { text: '😌 Уверенность', callback_data: 'quiz_q1:confidence' }
    ]
  },
  q2: {
    text: '2/4. Что тормозит больше всего?',
    buttons: [
      { text: '🙈 Слова «вылетают»', callback_data: 'quiz_q2:words' },
      { text: '😳 Страх ошибок', callback_data: 'quiz_q2:errors' },
      { text: '🙊 Молчу', callback_data: 'quiz_q2:silent' },
      { text: '📚 Грамматика', callback_data: 'quiz_q2:grammar' }
    ]
  },
  q3: {
    text: '3/4. Насколько срочно? (1 — не горит, 10 — горит 🔥)',
    buttons: Array.from({ length: 10 }, (_, i) => ({
      text: String(i + 1),
      callback_data: `quiz_q3:${i + 1}`
    }))
  },
  q4: {
    text: '4/4. Сколько времени в день готова выделять?',
    buttons: [
      { text: '5 мин', callback_data: 'quiz_q4:5' },
      { text: '15 мин', callback_data: 'quiz_q4:15' },
      { text: '30 мин+', callback_data: 'quiz_q4:30' }
    ]
  }
};

export const TIER23_PITCH = `Твой 🔥 = {urgency}/10 — люблю такой драйв!  
При *{time} мин в день* живые занятия дадут максимально быстрый рывок.

📅 Предлагаю 10‑мин Zoom, покажу формат и подберём пакет:
— *Tier 2* $ 333/мес (1×1 раз/нед)
— *Tier 3* $ 555/мес (2×1:1 в неделю)`;

export const TIER1_PITCH = `Вижу, времени маловато — значит, нужен умный *«10 мин в день»‑план!* 🚶‍♀️✨  
Скачай пробную *Week‑Map* и посмотри первый урок.`;

export const CALENDLY_URL = 'https://calendly.com/finnomaryia/english-with-ease-confidence-first-step';
export const TIER1_WEEKMAP_URL = 'https://your.site/week-map.pdf';
export const TIER1_PAYMENT_URL = 'https://your.site/pay';
