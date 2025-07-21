import schedule from 'node-schedule';
import { bot } from './bot.js';
import { getState } from './db.js';

/* раз в час проверяем напоминалки */
schedule.scheduleJob('*/60 * * * *', async () => {
  for (const [uid, st] of Object.entries(bot.context.db.data.users)) {
    if (st.tag === 'await_voice') {
      const diff = Date.now() - st.tagTS;
      if (diff > 24 * 3600e3 && !st.firstPing) {
        await bot.telegram.sendMessage(uid, 'Как идут фразы? 📣 Запиши один примерчик.');
        st.firstPing = true;
      } else if (diff > 48 * 3600e3 && !st.secondPing) {
        await bot.telegram.sendMessage(uid, 'Жми «Быстрый план», если некогда записывать.');
        st.secondPing = true;
      }
    }
  }
});