import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { PHRASES } from '../config/texts.js';
import { setState } from './db.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

const VOICE_PATHS = {
  small: 'voices/7фраз.ogg',
  doc: 'voices/Доктор.ogg',
  shop: 'voices/Магазин.ogg',
  school: 'voices/Школа.ogg',
  bank: 'voices/Банк.ogg'
};

// /start survival
bot.start(async ctx => {
  if (ctx.startPayload !== 'survival') return;
  await ctx.reply(
    'Привет, солнечная! ☀️ Я Мария из Speak & Shine.\n\nВот твой мини‑пак Survival Pack 🗣️.\nВыбери, какая ситуация жмёт сильнее всего — пришлю 7 нужных фраз + аудио прямо здесь.',
    Markup.inlineKeyboard([
      [{ text: '🩺 Доктор', callback_data: 'doc' }, { text: '🏪 Магазин', callback_data: 'shop' }],
      [{ text: '🏫 Школа', callback_data: 'school' }, { text: '🏦 Банк', callback_data: 'bank' }],
      [{ text: '☕ Small Talk', callback_data: 'small' }]
    ])
  );
});

// Обработка кнопок
bot.action(/^(small|doc|shop|school|bank)$/, async ctx => {
  const key = ctx.match[1];
  const phrase = PHRASES[key];
  const voicePath = path.resolve(`voices/${VOICE_PATHS[key]}`);

  try {
    await ctx.replyWithVoice({ source: fs.createReadStream(voicePath) }, {
      caption: phrase.caption
    });
  } catch (err) {
    console.error(`❌ Ошибка при отправке voice (${key}):`, err.message);
    await ctx.reply('⚠️ Не удалось отправить голос. Попробуй позже.');
  }

  await ctx.reply('Готово! Теперь запиши 3 своих фразы 👇', Markup.inlineKeyboard([
    [{ text: '📝 Записать 3 фразы', callback_data: 'rec_voice' }]
  ]));

  await ctx.answerCbQuery();
  setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
});

// Обработка голосовых от пользователя
bot.on('voice', async ctx => {
  await ctx.forwardMessage(process.env.ADMIN_CHAT_ID, ctx.from.id, ctx.message.message_id);
  await ctx.reply('Супер, запись получила! 🎉 Фидбэк пришлю чуть позже.');
  setState(ctx.from.id, { tag: 'voice_pending' });
});

// Запуск
bot.launch().then(() => {
  console.log('🚀 Bot running via WebHook');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
