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
  doc:    'доктор.ogg',
  shop:   'магазин.ogg',
  school: 'школа.ogg',
  bank:   'банк.ogg',
  small:  '7фраз.ogg',
};

// Логирование всех апдейтов для отладки
bot.on('update', ctx => console.log('📬 got update:', JSON.stringify(ctx.update)));

// /start — сразу показываем меню выбора пакета
bot.start(async ctx => {
  await ctx.replyWithHTML(WELCOME, Markup.inlineKeyboard(SURVIVAL_MENU));
});

// 1) Выбор Survival Pack
bot.action(/^(doc|shop|school|bank|small)$/, async ctx => {
  const key = ctx.match[1];
  const { caption } = PHRASES[key];
  const voicePath = path.join(voicesDir, VOICE_FILES[key]);

  try {
    if (!fs.existsSync(voicePath)) throw new Error(`File not found: ${voicePath}`);
    await ctx.replyWithVoice(
      { source: fs.createReadStream(voicePath) },
      { caption, parse_mode: 'HTML' }
    );
    await ctx.replyWithHTML(AFTER_FILE);
    setState(ctx.from.id, { tag: 'await_voice' });
  } catch (err) {
    console.error(`❌ Ошибка отправки voice (${key}):`, err.message);
    await ctx.reply('⚠️ Не удалось отправить аудио. Попробуйте позже.');
  } finally {
    await ctx.answerCbQuery();
  }
});

// 2) Универсальный обработчик голосовых сообщений
const ADMIN_ID = String(process.env.ADMIN_CHAT_ID);
bot.on('voice', async ctx => {
  const uid      = ctx.from.id;
  const st       = getState(uid) || {};

  // 2A) если пользователь в состоянии await_voice — это клиентский голос
  if (st.tag === 'await_voice') {
    // форвардим админу
    await ctx.forwardMessage(ADMIN_ID);
    // сохраняем, что ждём фидбека
    setState(uid, { tag: 'voice_pending' });
    // сообщаем клиенту
    await ctx.replyWithHTML(
      '🎉 Запись получила! Пока готовлю фидбек, давай настроим твой план:',
      Markup.inlineKeyboard([[{ text: '🚀 Старт опроса', callback_data: 'start_quiz' }]])
    );
    return;
  }

  // 2B) если админ отвечает на форвард — возвращаем фидбек клиенту
  const fromId = String(ctx.from.id);
  if (fromId === ADMIN_ID && ctx.chat.type === 'private') {
    const replyTo = ctx.message.reply_to_message;
    if (replyTo && replyTo.forward_from) {
      const clientId = replyTo.forward_from.id;
      // шлём голос админа клиенту
      await bot.telegram.sendVoice(clientId, { source: ctx.message.voice.file_id });
      // уведомляем
      await bot.telegram.sendMessage(
        clientId,
        '✅ <b>Фидбек готов!</b> Слушай и повторяй за мной.',
        { parse_mode: 'HTML' }
      );
      // сброс состояния
      setState(clientId, {});
    }
    return;
  }
});

// 3) Старт квиза
bot.action('start_quiz', async ctx => {
  setState(ctx.from.id, { quiz_answers: {} });
  await ctx.editMessageText(QUIZ.q1.text, Markup.inlineKeyboard(QUIZ.q1.buttons));
  await ctx.answerCbQuery();
});

// 4) Ответы квиза
bot.action(/^quiz_q(\d):(.*)$/, async ctx => {
  const uid     = ctx.from.id;
  const qNum    = +ctx.match[1];
  const answer  = ctx.match[2];
  const st      = getState(uid) || {};
  const answers = { ...(st.quiz_answers || {}), [`q${qNum}`]: answer };
  setState(uid, { quiz_answers: answers });

  const nextQ = QUIZ[`q${qNum + 1}`];
  if (nextQ) {
    await ctx.editMessageText(nextQ.text, Markup.inlineKeyboard(nextQ.buttons));
  } else {
    await ctx.editMessageText('✅ Готово! Считаю твой идеальный план...');
    await finishQuiz(ctx, answers);
  }
  await ctx.answerCbQuery();
});

// 5) Завершение квиза и ветвление логики
async function finishQuiz(ctx, answers) {
  const uid     = ctx.from.id;
  const urgency = +answers.q3;
  const time    = answers.q4;

  if (urgency >= 7 && ['15','30','30+'].includes(time)) {
    setState(uid, { tag: 'lead_tier23' });
    const text = TIER23_PITCH.replace('{urgency}', urgency).replace('{time}', time);
    await ctx.replyWithHTML(text, Markup.inlineKeyboard([
      [ Markup.button.url('🔸 Забронировать Zoom', CALENDLY_URL) ]
    ]));
  } else {
    setState(uid, { tag: 'lead_tier1' });
    await ctx.replyWithHTML(TIER1_PITCH, Markup.inlineKeyboard([
      [Markup.button.url('🔸 Скачать WEEK‑MAP', TIER1_WEEKMAP_URL)],
      [Markup.button.url('🔸 Оплатить $111', TIER1_PAYMENT_URL)]
    ]));
  }
}

// Обработка нажатия "book_zoom"
bot.action('book_zoom', async ctx => {
  await ctx.replyWithHTML(`Записывайся сюда: <a href="${CALENDLY_URL}">${CALENDLY_URL}</a>`);
  setState(ctx.from.id, { tag: 'call_pending' });
  await ctx.answerCbQuery();
});

// Регистрируем задачи напоминания
import './scheduler.js';

// Запуск polling при локальной разработке
// bot.launch();

// graceful stop
process.once('SIGINT', () => bot.stop());
process.once('SIGTERM', () => bot.stop());
