// src/webhook.js
import express from 'express';
import 'dotenv/config';
import { bot } from './bot.js';

const app = express();
const PORT = process.env.PORT || 3000;
const WEBHOOK_URL = process.env.WEBHOOK_URL;

async function start() {
  try {
    if (WEBHOOK_URL) {
      console.log('🔗 WEBHOOK_URL =', WEBHOOK_URL);

      // ждём установки webhook
      const setRes = await bot.telegram.setWebhook(`${WEBHOOK_URL}/webhook`);
      console.log('✅ setWebhook result:', setRes);

      // проверяем, что реально стоит
      const info = await bot.telegram.getWebhookInfo();
      console.log('ℹ️ getWebhookInfo:', info);

      // теперь Express будет принимать POST /webhook
      app.use(bot.webhookCallback('/webhook'));
      app.listen(PORT, () => {
        console.log(`🚀 Webhook server listening on port ${PORT}`);
      });
    } else {
      console.log('⚠️ WEBHOOK_URL not set, falling back to polling');
      await bot.launch();
      console.log('🚀 Bot running via polling');
    }
  } catch (err) {
    console.error('❌ Error starting bot:', err);
    process.exit(1);
  }
}

start();
