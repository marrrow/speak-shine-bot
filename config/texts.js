export const WELCOME = 'Привет, солнечная! ☀️ Я <b>Мария</b> из <i>Speak & Shine</i>.\n\nВот твой мини‑пак <b>Survival Pack 🗣️</b>.\nВыбери, какая ситуация жмёт сильнее всего — пришлю <b>7 нужных фраз + аудио</b> прямо здесь.';
export const SURVIVAL_MENU = [
  [{ text: '🩺 Доктор', data: 'doc' }, { text: '🏪 Магазин', data: 'shop' }],
  [{ text: '🏫 Школа', data: 'school' }, { text: '🏦 Банк', data: 'bank' }],
  [{ text: '☕ Small Talk', data: 'small' }]
];

/* file_id аудио, полученные заранее командой /sendvoice */
export const PHRASES = {
  doc: {
    caption: '«Тут текст по теме визита к врачу»',
    voice: 'AwADBAAD...doc'
  },
  shop: { caption: '«Тут текст по теме магазина»', voice: 'AwADBAAD...shop' },
  school:{ caption:'«Frases para escuela»', voice:'AwADBAAD...school'},
  bank:  { caption:'«Тут текст по теме банка»',  voice:'AwADBAAD...bank' },
  small: { caption:'«Small‑talk набор»',        voice:'AwADBAAD...small'}
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
