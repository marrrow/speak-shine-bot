import { Telegraf, Markup } from 'telegraf';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // Импортируем для __dirname
import { PHRASES, WELCOME, SURVIVAL_MENU, AFTER_FILE } from '../config/texts.js'; // Убедитесь, что путь правильный
import { setState, getState } from './db.js'; // Добавим getState

// ЭКСПОРТИРУЕМ bot, чтобы scheduler.js мог его использовать
export const bot = new Telegraf(process.env.BOT_TOKEN);

// --- НАДЁЖНОЕ ОПРЕДЕЛЕНИЕ ПУТЕЙ ---
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Путь от src/bot.js наверх к корню проекта, а затем в /voices
const voicesDir = path.resolve(__dirname, '..', 'voices');

const VOICE_PATHS = {
  doc: 'Доктор.ogg',
  shop: 'Магазин.ogg', // Убедитесь, что имена файлов точно совпадают
  school: 'Школа.ogg',
  bank: 'Банк.ogg',
  small: '7фраз.ogg'
};

// /start survival
bot.start(async (ctx) => {
  if (ctx.startPayload !== 'survival') return;
  await ctx.reply(WELCOME, { // Используйте reply, а не replyWithHTML, если используете Markdown в texts.js
      parse_mode: 'Markdown',
      ...Markup.inlineKeyboard(SURVIVAL_MENU)
  });
});

// При нажатии на кнопку "Доктор" / "Магазин" и т.д.
bot.action(/^(doc|shop|school|bank|small)$/, async (ctx) => {
  const key = ctx.match[1];
  const phrase = PHRASES[key];
  const voicePath = path.join(voicesDir, VOICE_PATHS[key]);

  console.log(`Trying to send voice: ${voicePath}`); // Лог для отладки

  try {
    if (!fs.existsSync(voicePath)) {
        throw new Error(`File not found at ${voicePath}`);
    }
    // Отправка голосового из локального файла
    await ctx.replyWithVoice({ source: fs.createReadStream(voicePath) }, {
      caption: phrase.caption,
      parse_mode: 'Markdown'
    });

    // После voice — предлагаем записать свои 3 фразы
    await ctx.reply(AFTER_FILE, {
        parse_mode: 'Markdown',
        ...Markup.inlineKeyboard([
          [{ text: '📝 Записать 3 фразы', callback_data: 'rec_voice' }]
        ])
    });

    setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });

  } catch (err) {
    console.error(`❌ Ошибка отправки voice (${key}):`, err.message);
    await ctx.reply('⚠️ Ой, не удалось отправить аудио. Пожалуйста, попробуйте позже.');
  } finally {
    await ctx.answerCbQuery();
  }
});

// Пользователь нажал "Записать 3 фразы"
bot.action('rec_voice', async (ctx) => {
  await ctx.reply('Жду твоё голосовое сообщение на 10–15 сек 🎙');
  await ctx.answerCbQuery();
  // Не сбрасываем tagTS, если пользователь нажимает кнопку несколько раз
  const currentState = getState(ctx.from.id);
  if (currentState.tag !== 'await_voice') {
      setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
  }
});


// Пользователь отправил voice
bot.on('voice', async (ctx) => {
  const uid = ctx.from.id;
  const st = getState(uid);
  
  // Реагируем только если ждем голос
  if (st.tag !== 'await_voice') return;

  await ctx.forwardMessage(process.env.ADMIN_CHAT_ID);
  await ctx.reply('Супер, запись получила! 🎉 Фидбэк пришлю чуть позже.');
  setState(uid, { tag: 'voice_pending' });
});

// Запуск бота
bot.launch().then(() => {
  console.log('🚀 Bot is running!');
});

// Включаем обработчик напоминаний
import './scheduler.js';

process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
