import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setState, getState } from './db.js';

// Импортируем все необходимые тексты и ссылки из конфига
// Убедитесь, что все эти переменные есть в вашем файле config/texts.js
import {
  WELCOME,
  SURVIVAL_MENU,
  PHRASES,
  AFTER_FILE,
  QUIZ, // Объект с вопросами и кнопками для опросника
  TIER1_PITCH,
  TIER23_PITCH,
  CALENDLY_URL,
  TIER1_WEEKMAP_URL, // Добавьте URL для Week-Map
  TIER1_PAYMENT_URL, // Добавьте URL для оплаты Tier 1
} from '../config/texts.js';

// Экспортируем bot, чтобы scheduler.js мог его использовать
export const bot = new Telegraf(process.env.BOT_TOKEN);

// --- Надёжное определение путей ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const voicesDir = path.resolve(__dirname, '..', 'voices');

const VOICE_PATHS = {
  doc: 'Доктор.ogg',
  shop: 'Магазин.ogg',
  school: 'Школа.ogg',
  bank: 'Банк.ogg',
  small: '7фраз.ogg',
};

// --- ОСНОВНАЯ ЛОГИКА БОТА ---

// /start survival
bot.start(async (ctx) => {
  if (ctx.startPayload !== 'survival') return;
  await ctx.reply(WELCOME, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(SURVIVAL_MENU),
  });
});

// 1. Пользователь выбрал Survival Pack
bot.action(/^(doc|shop|school|bank|small)$/, async (ctx) => {
  const key = ctx.match[1];
  const phrase = PHRASES[key];
  const voicePath = path.join(voicesDir, VOICE_PATHS[key]);

  console.log(`Trying to send voice: ${voicePath}`);

  try {
    if (!fs.existsSync(voicePath)) {
      throw new Error(`File not found at ${voicePath}`);
    }
    await ctx.replyWithVoice({ source: fs.createReadStream(voicePath) }, {
      caption: phrase.caption,
      parse_mode: 'Markdown',
    });
    await ctx.reply(AFTER_FILE, {
      parse_mode: 'Markdown',
    });
    setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
  } catch (err) {
    console.error(`❌ Ошибка отправки voice (${key}):`, err.message);
    await ctx.reply('⚠️ Ой, не удалось отправить аудио. Пожалуйста, попробуйте позже.');
  } finally {
    await ctx.answerCbQuery();
  }
});

// 2. Пользователь отправил голосовое сообщение
bot.on('voice', async (ctx) => {
  const uid = ctx.from.id;
  const st = getState(uid);

  if (st.tag !== 'await_voice') return;

  await ctx.forwardMessage(process.env.ADMIN_CHAT_ID);
  setState(uid, { tag: 'voice_pending' });

  // Сразу предлагаем начать опрос
  await ctx.reply(
    'Супер, запись получила! 🎉\nФидбэк пришлю чуть позже, а пока — давай настроим твой персональный план.\nВсего 4 кнопки, это меньше минуты. 🚀',
    Markup.inlineKeyboard([
      [{ text: '🚀 Старт опроса', callback_data: 'start_quiz' }],
    ])
  );
});

// --- ЛОГИКА ОПРОСНИКА (QUIZ) ---

// 3. Пользователь нажал "Старт опроса"
bot.action('start_quiz', async (ctx) => {
  const uid = ctx.from.id;
  setState(uid, { quiz_answers: {} }); // Очищаем старые ответы
  
  await ctx.editMessageText(QUIZ.q1.text, Markup.inlineKeyboard(QUIZ.q1.buttons));
  await ctx.answerCbQuery();
});

// Обработчики ответов на вопросы
bot.action(/^quiz_q(\d):(.+)$/, async (ctx) => {
  const uid = ctx.from.id;
  const questionNum = parseInt(ctx.match[1], 10);
  const answer = ctx.match[2];

  const st = getState(uid);
  const updatedAnswers = { ...st.quiz_answers, [`q${questionNum}`]: answer };
  setState(uid, { quiz_answers: updatedAnswers });

  const nextQuestionNum = questionNum + 1;
  const nextQuestion = QUIZ[`q${nextQuestionNum}`];

  if (nextQuestion) {
    // Если есть следующий вопрос, задаем его
    await ctx.editMessageText(nextQuestion.text, Markup.inlineKeyboard(nextQuestion.buttons));
  } else {
    // Вопросы закончились, завершаем опрос
    await ctx.editMessageText('✅ Готово! Считаю твой идеальный план...');
    await finishQuiz(ctx, updatedAnswers);
  }
  await ctx.answerCbQuery();
});

// 4. Завершение опроса и ветвление логики
async function finishQuiz(ctx, answers) {
  const uid = ctx.from.id;
  const urgency = parseInt(answers.q3, 10);
  const time = answers.q4;

  // Логика ветвления
  if (urgency >= 7 && (time === '15' || time === '30+')) {
    // ВЕТКА TIER 2/3 (Calendly)
    setState(uid, { tag: 'lead_tier23' });
    const pitchText = TIER23_PITCH
        .replace('{urgency}', urgency)
        .replace('{time}', time);
    await ctx.reply(pitchText, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.url('🔸 Бронирую 10-мин Zoom', CALENDLY_URL)]
        ])
    });
  } else {
    // ВЕТКА TIER 1
    setState(uid, { tag: 'lead_tier1' });
    await ctx.reply(TIER1_PITCH, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
            [Markup.button.url('🔸 Скачать WEEK-MAP', TIER1_WEEKMAP_URL)],
            [Markup.button.url('🔸 Оплатить $111', TIER1_PAYMENT_URL)],
        ])
    });
  }
}

// --- ЗАПУСК БОТА И ПЛАНИРОВЩИКА ---

bot.launch().then(() => {
  console.log('🚀 Bot is running!');
});

// Включаем обработчик напоминаний
import './scheduler.js';

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
