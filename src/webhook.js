import express from 'express';
import 'dotenv/config';
import { bot } from './bot.js';

const app = express();
const PORT = process.env.PORT || 3000;

bot.telegram.setWebhook(`${process.env.WEBHOOK_URL}/webhook`);
app.use(bot.webhookCallback('/webhook'));

app.listen(PORT, () => {
  console.log(`🚀 Webhook server listening on port ${PORT}`);
});
