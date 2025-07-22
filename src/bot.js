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
  await ctx.reply(WELCOME, {
    parse_mode: 'HTML',
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
      { caption, parse_mode: 'HTML' }
    );
    await ctx.replyWithHTML(AFTER_FILE);
    setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
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
  const chatType = ctx.chat.type;
  const fromId   = String(ctx.from.id);

  // 2A) Клиент отправил голосовое сообщение
  if (chatType === 'private' && fromId !== ADMIN_ID) {
    const clientId = ctx.from.id;
    await ctx.forwardMessage(ADMIN_ID);
    setState(clientId, { tag: 'voice_pending' });
    await ctx.reply(
      '🎉 Запись получилa! Я скоро пришлю фидбек, а пока настроим твой план.',
      Markup.inlineKeyboard([[{ text: '🚀 Старт опроса', callback_data: 'start_quiz' }]])
    );
    return;
  }

  // 2B) Админ отвечает на форвард клиента
  if (chatType === 'private' && fromId === ADMIN_ID) {
    const replyTo = ctx.message.reply_to_message;
    if (replyTo && replyTo.forward_from) {
      const clientId = replyTo.forward_from.id;
      await bot.telegram.sendVoice(clientId, { source: ctx.message.voice.file_id });
      await bot.telegram.sendMessage(
        clientId,
        '✅ <b>Фидбек готов!</b> Слушай ответ и, если нужно, пробуй ещё раз.',
        { parse_mode: 'HTML' }
      );
      setState(clientId, {});
    }
    return;
  }

  // прочие случаи игнорируем
});

// 3) Старт квиза
bot.action('start_quiz', async ctx => {
  setState(ctx.from.id, { quiz_answers: {} });
  await ctx.editMessageText(QUIZ.q1.text, Markup.inlineKeyboard(QUIZ.q1.buttons));
  await ctx.answerCbQuery();
});

// 4) Ответы квиза
bot.action(/^quiz_q(\d):(.*)$/, async ctx => {
  const uid      = ctx.from.id;
  const qNum     = +ctx.match[1];
  const answer   = ctx.match[2];
  const st       = getState(uid);
  const updated  = { ...st.quiz_answers, [`q${qNum}`]: answer };
  setState(uid, { quiz_answers: updated });
  const nextNum = qNum + 1;
  const nextQ   = QUIZ[`q${nextNum}`];

  if (nextQ) {
    await ctx.editMessageText(nextQ.text, Markup.inlineKeyboard(nextQ.buttons));
  } else {
    await ctx.editMessageText('✅ Готово! Считаю твой идеальный план...');
    await finishQuiz(ctx, updated);
  }
  await ctx.answerCbQuery();
});

// 5) Завершение квиза и ветвление логики
async function finishQuiz(ctx, answers) {
  const uid     = ctx.from.id;
  const urgency = +answers.q3;
  const time    = answers.q4;

  if (urgency >= 7 && (time === '15' || time === '30+')) {
    setState(uid, { tag: 'lead_tier23' });
    const text = TIER23_PITCH.replace('{urgency}', urgency).replace('{time}', time);
    await ctx.replyWithHTML(
      text,
      Markup.inlineKeyboard([
        [Markup.button.callback('🔸 Забронировать Zoom', 'book_zoom')]
      ])
    );
  } else {
    setState(uid, { tag: 'lead_tier1' });
    await ctx.replyWithHTML(
      TIER1_PITCH,
      Markup.inlineKeyboard([
        [Markup.button.url('🔸 Скачать WEEK-MAP', TIER1_WEEKMAP_URL)],
        [Markup.button.url('🔸 Оплатить $111', TIER1_PAYMENT_URL)],
      ])
    );
  }
}

// Обработчик брони Zoom (кнопка booking)
bot.action('book_zoom', async ctx => {
  await ctx.replyWithHTML('Записывайся сюда: ' + CALENDLY_URL);
  setState(ctx.from.id, { tag: 'call_pending' });
  await ctx.answerCbQuery();
});

// Регистрируем задачи напоминания
import './scheduler.js';

// Если нужно локально запустить polling, раскомментируйте:
// bot.launch().then(() => console.log('🚀 Bot launched via polling'));
