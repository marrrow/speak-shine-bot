// src/webhook.js
import express from 'express';
import 'dotenv/config';
import { bot } from './bot.js';

const app         = express();
const PORT        = process.env.PORT        || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

// Обязательно регистрируем Telegram‑middleware до listen()
app.use(bot.webhookCallback('/webhook'));

async function start() {
  // Поднимаем HTTP‑сервер
  app.listen(PORT, async () => {
    console.log(`🚀 Webhook server listening on port ${PORT}`);

    // Если WEBHOOK_URL не задан, переключаем на polling
    if (!WEBHOOK_URL) {
      console.warn('⚠️ WEBHOOK_URL is not set, falling back to polling');
      await bot.launch();
      console.log('🚀 Bot launched via polling');
      return;
    }

    // Устанавливаем webhook для Telegram
    const fullUrl = `${WEBHOOK_URL}/webhook`;
    console.log('🔗 Setting webhook to', fullUrl);
    try {
      const setRes = await bot.telegram.setWebhook(fullUrl);
      console.log('✅ setWebhook result:', setRes);

      const info = await bot.telegram.getWebhookInfo();
      console.log('ℹ️ getWebhookInfo:', info);
    } catch (err) {
      console.error('❌ Failed to setWebhook:', err);
    }
  });
}

start().catch(err => {
  console.error('❌ Fatal error starting webhook server:', err);
  process.exit(1);
});
