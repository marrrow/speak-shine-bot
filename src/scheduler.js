import schedule from 'node-schedule';
import { bot } from './bot.js'; // Теперь импорт будет работать
import { db, setState } from './db.js'; // Импортируем db и setState напрямую

// Запускаем проверку раз в час
schedule.scheduleJob('0 * * * *', async () => {
  console.log('Running scheduled reminder check...');

  // Получаем пользователей напрямую из объекта db
  for (const [uid, st] of Object.entries(db.data.users)) {
    if (st.tag === 'await_voice') {
      const diff = Date.now() - st.tagTS;

      // Прошло > 24 часов и первое напоминание не отправлено
      if (diff > 24 * 3600e3 && !st.firstPing) {
        console.log(`Sending 24h reminder to ${uid}`);
        await bot.telegram.sendMessage(uid, 'Как идут фразы? 📣 Запиши один примерчик — подправлю акцент за минутку!');
        // Сохраняем изменение в базу данных
        setState(uid, { ...st, firstPing: true });
      }
      // Прошло > 48 часов и второе напоминание не отправлено
      else if (diff > 48 * 3600e3 && !st.secondPing) {
        console.log(`Sending 48h reminder to ${uid}`);
        await bot.telegram.sendMessage(uid, "Если сейчас совсем некогда, жми 🔸 Быстрый план — подсвечу шаги без голосовой. 😊", {
            parse_mode: 'Markdown',
            ...Markup.inlineKeyboard([[{ text: '🔸 Быстрый план', callback_data: 'start_quiz' }]])
        });
        // Сохраняем изменение в базу данных
        setState(uid, { ...st, secondPing: true });
      }
    }
  }
});

console.log('⏰ Scheduler initialized.');
