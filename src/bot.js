import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { PHRASES, WELCOME, SURVIVAL_MENU, AFTER_FILE } from '../config/texts.js';
import { setState } from './db.js';

const bot = new Telegraf(process.env.BOT_TOKEN);

// соответствие кнопок и .ogg файлов
const VOICE_PATHS = {
  doc: 'Доктор.ogg',
  shop: 'Магазин.ogg',
  school: 'Школа.ogg',
  bank: 'Банк.ogg',
  small: '7фраз.ogg'
};

// /start survival
bot.start(async ctx => {
  if (ctx.startPayload !== 'survival') return;
  await ctx.replyWithHTML(WELCOME, Markup.inlineKeyboard(SURVIVAL_MENU));
});

// При нажатии на кнопку "Доктор" / "Магазин" и т.д.
bot.action(/^(doc|shop|school|bank|small)$/, async ctx => {
  const key = ctx.match[1];
  const phrase = PHRASES[key];
  const voicePath = path.resolve(`voices/${VOICE_PATHS[key]}`);

  try {
    // Отправка голосового из локального файла
    await ctx.replyWithVoice({ source: fs.createReadStream(voicePath) }, {
      caption: phrase.caption
    });
  } catch (err) {
    console.error(`❌ Ошибка отправки voice (${key}):`, err.message);
    await ctx.reply('⚠️ Не удалось отправить голос. Попробуй позже.');
  }

  // После voice — предлагаем записать свои 3 фразы
  await ctx.reply(AFTER_FILE, Markup.inlineKeyboard([
    [{ text: '📝 Записать 3 фразы', callback_data: 'rec_voice' }]
  ]));

  await ctx.answerCbQuery();
  setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
});

// Пользователь нажал "Записать 3 фразы"
bot.action('rec_voice', async ctx => {
  await ctx.reply('Жду твоё голосовое сообщение на 10–15 сек 🎙');
  await ctx.answerCbQuery();
  setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
});

// Пользователь отправил voice
bot.on('voice', async ctx => {
  await ctx.forwardMessage(process.env.ADMIN_CHAT_ID, ctx.from.id, ctx.message.message_id);
  await ctx.reply('Супер, запись получила! 🎉 Фидбэк пришлю чуть позже.');
  setState(ctx.from.id, { tag: 'voice_pending' });
});

// Запуск бота
bot.launch().then(() => {
  console.log('🚀 Bot running via WebHook');
});

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
