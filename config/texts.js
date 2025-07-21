export const WELCOME = 'Привет, солнечная! ☀️ Я <b>Мария</b> из <i>Speak & Shine</i>.\n\nВот твой мини‑пак <b>Survival Pack 🗣️</b>.\nВыбери, какая ситуация жмёт сильнее всего — пришлю <b>7 нужных фраз + аудио</b> прямо здесь.';
export const SURVIVAL_MENU = [
  [{ text: '🩺 Доктор', data: 'doc' }, { text: '🏪 Магазин', data: 'shop' }],
  [{ text: '🏫 Школа', data: 'school' }, { text: '🏦 Банк', data: 'bank' }],
  [{ text: '☕ Small Talk', data: 'small' }]
];

/* file_id аудио, полученные заранее командой /sendvoice */
export const PHRASES = {
  small: {
    caption: `🤝 7 фраз для знакомства и лёгкой беседы 🌷🌷🌷

1. Hi! I like your bag / dress / jacket.
→ Привет! Мне нравится ваша сумка / платье / куртка.

2. This weather is so nice today!
→ Сегодня такая приятная погода!

3. It’s really hot today, isn’t it?
→ Сегодня прям жарко, правда?

4. I see you here often!
→ Я вас часто здесь вижу!

5. Do you live nearby?
→ Вы рядом живёте?

6. Your kids are so cute! How old are they?
→ Такие милые дети! Сколько им лет?

7. I’m Maria, by the way. And what is your name?
→ Кстати, я Мария. А как вас зовут?

Произношение. Пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voice: 'AwACAgQAAxkDAAMCaH5YNUEAAdZyJBkdZzEyLLFxl7acAALnGQACcGrwUzIfmnXtlgIBNgQ'
  },
  bank: {
    caption: `🏦 Фразы для звонков, переводов, ошибок и писем

1. I have a question about my account.
→ У меня вопрос по счёту.

2. I saw a strange charge here.
→ Здесь странное списание.

3. Can you explain this letter to me?
→ Объясните, пожалуйста, это письмо.

4. I want to send money to another account.
→ Хочу перевести деньги на другой счёт.

5. What documents do I need to bring?
→ Какие документы нужно принести?

6. I need to order a new card. I lost mine.
→ Мне нужно заказать новую карту. Я потеряла свою.

7. Can I open a joint account with my husband?
→ Можно открыть совместный счёт с мужем?

Произношение. Пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voice: 'AwACAgQAAxkDAAMDaH5Yi5Xi8NAqOS5yb3JySHjdkLUAAukZAAJwavBT9EW7O1DPUhk2BA'
  },
  doc: {
    caption: `🩺 Фразы для визита к врачу, страховки, жалоб и объяснений

1. I have an appointment at 10.
→ У меня запись на 10.

2. I don’t feel well.
→ Мне нехорошо.

3. My throat hurts and I have a fever.
→ У меня болит горло и температура.

4. It started three days ago.
→ Началось три дня назад.

5. Is this covered by insurance?
→ Это покрывает страховка?

6. I already took Tylenol, but it didn’t help.
→ Я уже пила Тайленол, но не помогло.

7. Do I need a note for school/work?
→ Нужна справка для школы/работы?

Произношение. Пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voice: 'AwACAgQAAxkDAAMEaH5YuC-PIRN6lcR08wQ9yl7n5MwAAuoZAAJwavBTvwABe3p5ZVVENgQ'
  },
  shop: {
    caption: `🛍 Фразы для магазинов, примерки, возврата, вопросов

1. Excuse me, can you please help me find eggs?
→ Извините, вы можете помочь мне найти яйца?

2. Do you have this in a bigger/ smaller size?
→ У вас есть это побольше или поменьше?

3. How much is this?
→ Сколько это стоит?

4. Where is the fitting room?
→ Где примерочная?

5. I’d like to return this — it didn’t fit.
→ Хочу вернуть это — не подошло.

6. Can I return this? It’s spoiled.
→ Можно вернуть это? Оно испорчено.

7. Are there any discounts on this?
→ На это есть скидка?

Произношение. Пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voice: 'AwACAgQAAxkDAAMFaH5Y4K91Pt83LOFGRyNXS8FneUgAAusZAAJwavBTxsCdfCVA2gE2BA'
  },
  school: {
    caption: `🎒 Фразы для учительницы, домашки, поддержки ребёнка

1. Hi, I’m Anna’s mom.
→ Здравствуйте, я мама Анны.

2. Can I ask about her homework?
→ Можно спросить про домашку?

3. Is everything okay in class?
→ Всё ли хорошо в классе?

4. Is there anything we can do at home to help her?
→ Мы можем как-то помочь ей дома?

5. I think she needs extra help with reading.
→ Думаю, ей нужна дополнительная помощь по чтению.

6. Can we talk again next week?
→ Можем поговорить ещё раз на следующей неделе?

7. Thank you for your time and care.
→ Спасибо за ваше время и заботу.

Произношение. Пауза после каждой фразы — повторяй за мной 👇👇👇`,
    voice: 'AwACAgQAAxkDAAMGaH5ZDNBFwzlIOz-2ujLGJL8xxksAAu0ZAAJwavBTY2VIsXkGnCA2BA'
  }
};

export const AFTER_FILE = `Готово!  
Теперь выбери *ЛЮБЫЕ 3 фразы* из пакета, запиши их голосом (10–15 с) —
и я пришлю тебе личную обратную связь. 💛`;

export const QUIZ = {
  q1: 'Зачем английский?',
  q1buttons: [
    [{text:'🏡 Жизнь',data:'life'},{text:'💼 Работа',data:'work'}],
    [{text:'🏫 Школа/дети',data:'kids'},{text:'😌 Уверенность',data:'conf'}]
  ],
  // … остальные вопросы/кнопки
};

export const TIER23_PITCH = `Твой 🔥 = {urgency}/10 — люблю такой драйв!  
При *{time} мин в день* живые занятия дадут максимальный рывок.

📅 Предлагаю 10‑мин Zoom, покажу формат и подберём пакет:
— *Tier 2* $ 333/мес (1×1 раз/нед)  
— *Tier 3* $ 555/мес (2×1:1 в неделю)`;

export const TIER1_PITCH = `Вижу, времени маловато — значит, нужен умный *«10 мин в день»‑план!* 🚶‍♀️✨  
Скачай пробную *Week‑Map* и посмотри первый урок.`;

/* …другие шаблоны сообщений … */
