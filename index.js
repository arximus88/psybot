require('dotenv').config()
const TelegramBot = require('node-telegram-bot-api');
const token = process.env.YOUR_TELEGRAM_BOT_TOKEN

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  bot.sendMessage(msg.chat.id, 'Hello World!');
});
