// src/bot.js
// Основная логика бота, экспортируется для webhook.js и scheduler.js

import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { setState, getState } from './db.js';
import {
  WELCOME,
  SURVIVAL_MENU,
  PHRASES,
  AFTER_FILE,
  QUIZ,
  TIER1_PITCH,
  TIER23_PITCH,
  CALENDLY_URL,
  TIER1_WEEKMAP_URL,
  TIER1_PAYMENT_URL,
} from '../config/texts.js';

// Создаём экземпляр бота
export const bot = new Telegraf(process.env.BOT_TOKEN);

// Папка с голосовыми файлами
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);
const voicesDir  = path.resolve(__dirname, '..', 'voices');

const VOICE_FILES = {
  doc:    'Доктор.ogg',
  shop:   'Магазин.ogg',
  school: 'Школа.ogg',
  bank:   'Банк.ogg',
  small:  '7фраз.ogg',
};

// Логирование всех апдейтов для отладки
bot.on('update', ctx => console.log('📬 got update:', JSON.stringify(ctx.update)));

// /start — сразу показываем меню выбора пакета
bot.start(async ctx => {
  await ctx.reply(WELCOME, {
    parse_mode: 'Markdown',
    ...Markup.inlineKeyboard(SURVIVAL_MENU),
  });
});

// 1) Выбор Survival Pack
bot.action(/^(doc|shop|school|bank|small)$/, async ctx => {
  const key = ctx.match[1];
  const { caption } = PHRASES[key];
  const voicePath = path.join(voicesDir, VOICE_FILES[key]);
  console.log(`Trying to send voice: ${voicePath}`);
  try {
    if (!fs.existsSync(voicePath)) throw new Error(`File not found: ${voicePath}`);
    await ctx.replyWithVoice(
      { source: fs.createReadStream(voicePath) },
      { caption, parse_mode: 'Markdown' }
    );
    await ctx.reply(AFTER_FILE, { parse_mode: 'Markdown' });
    setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
  } catch (err) {
    console.error(`❌ Ошибка отправки voice (${key}):`, err.message);
    await ctx.reply('⚠️ Не удалось отправить аудио. Попробуйте позже.');
  } finally {
    await ctx.answerCbQuery();
  }
});

// 2) Получили голосовое сообщение от пользователя
bot.on('voice', async ctx => {
  const uid = ctx.from.id;
  const st  = getState(uid);
  if (st.tag !== 'await_voice') return;
  // Форвардим хозяину
  await ctx.forwardMessage(process.env.ADMIN_CHAT_ID);
  setState(uid, { tag: 'voice_pending' });
  // Предлагаем начать квиз
  await ctx.reply(
    'Супер, запись получила! 🎉\nФидбэк пришлю чуть позже, а пока — давай настроим твой персональный план.\nВсего 4 кнопки, это меньше минуты. 🚀',
    Markup.inlineKeyboard([[{ text: '🚀 Старт опроса', callback_data: 'start_quiz' }]])
  );
});

// 3) Старт квиза
bot.action('start_quiz', async ctx => {
  setState(ctx.from.id, { quiz_answers: {} });
  await ctx.editMessageText(QUIZ.q1.text, Markup.inlineKeyboard(QUIZ.q1.buttons));
  await ctx.answerCbQuery();
});

// 4) Ответы квиза
bot.action(/^quiz_q(\d):(.*)$/, async ctx => {
  const uid         = ctx.from.id;
  const qNum        = +ctx.match[1];
  const answer      = ctx.match[2];
  const st          = getState(uid);
  const updated     = { ...st.quiz_answers, [`q${qNum}`]: answer };
  setState(uid, { quiz_answers: updated });
  const nextQNum = qNum + 1;
  const nextQ    = QUIZ[`q${nextQNum}`];
  if (nextQ) {
    await ctx.editMessageText(nextQ.text, Markup.inlineKeyboard(nextQ.buttons));
  } else {
    await ctx.editMessageText('✅ Готово! Считаю твой идеальный план...');
    await finishQuiz(ctx, updated);
  }
  await ctx.answerCbQuery();
});

// 5) Завершение квиза и ветвление
async function finishQuiz(ctx, answers) {
  const uid     = ctx.from.id;
  const urgency = +answers.q3;
  const time    = answers.q4;
  if (urgency >= 7 && (time === '15' || time === '30+')) {
    setState(uid, { tag: 'lead_tier23' });
    const text = TIER23_PITCH.replace('{urgency}', urgency).replace('{time}', time);
    await ctx.reply(text, {
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard([[Markup.button.url('🔸 Бронирую Zoom', CALENDLY_URL)]])
    });
  } else {
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

// Регистрируем задачи напоминания
import './scheduler.js';
