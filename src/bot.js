import 'dotenv/config';
import { Telegraf, Markup } from 'telegraf';
import { db, getState, setState } from './db.js';
import * as T from '../config/texts.js';

export const bot = new Telegraf(process.env.BOT_TOKEN);

/* helper для быстрого меню */
const buildKeyboard = rows =>
  Markup.inlineKeyboard(rows.map(r => r.map(b => Markup.button.callback(b.text, b.data))));

bot.start(async ctx => {
  await ctx.replyWithHTML(T.WELCOME, buildKeyboard(T.SURVIVAL_MENU));
  setState(ctx.from.id, { step: 'menu' });
});

/* выбор ситуации */
bot.action(/^(doc|shop|school|bank|small)$/, async ctx => {
  const key = ctx.match[1];
  const ph = T.PHRASES[key];
  await ctx.replyWithVoice(ph.voice, { caption: ph.caption });
  await ctx.reply(T.AFTER_FILE, buildKeyboard([[{ text: '📝 Записать 3 фразы', data: 'rec_voice' }]]));
  setState(ctx.from.id, { tag: 'await_voice', tagTS: Date.now() });
});

/* нажали «Записать 3 фразы» */
bot.action('rec_voice', async ctx => {
  await ctx.reply('Жду твой voice на 10‑15 сек. 🚀');
});

/* пришёл voice */
bot.on('voice', async ctx => {
  const uid = ctx.from.id;
  const st = getState(uid);
  if (st.tag !== 'await_voice') return;

  await ctx.forwardMessage(process.env.ADMIN_CHAT_ID, uid, ctx.message.message_id);
  await ctx.reply('Супер, запись получила! 🎉\nФидбэк пришлю чуть позже.');
  setState(uid, { tag: 'voice_pending' });
});

/* админ пишет /reload чтобы подтянуть правки в texts.js без redeploy */
bot.command('reload', async ctx => {
  if (ctx.chat.id != process.env.ADMIN_CHAT_ID) return;
  delete require.cache[require.resolve('../config/texts.js')];
  Object.assign(T, await import('../config/texts.js'));
  await ctx.reply('Конфиг перезагружен Ҿ');
});

/* запустить */
if (process.env.WEBHOOK_DOMAIN) {
  bot.launch({
    webhook: {
      domain: process.env.WEBHOOK_DOMAIN,
      port: process.env.PORT || 3000
    }
  });
  console.log('🚀 Bot running via WebHook');
} else {
  bot.launch().then(() => console.log('🚀 Bot running (getUpdates)'));
}
bot.on('voice', async ctx => {
  const fileId = ctx.message.voice.file_id;
  console.log('📥 Получен voice от', ctx.from.username || ctx.from.id);
  console.log('🎧 file_id:', fileId);

  await ctx.reply(`✓ Получил voice\nfile_id:\n<code>${fileId}</code>`, {
    parse_mode: 'HTML'
  });
});
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));
