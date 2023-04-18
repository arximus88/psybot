const OpenAI = require('openai');
const TelegramBot = require('node-telegram-bot-api');

// Set your OpenAI API key and Telegram Bot Token
const openaiApiKey = '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';
const telegramBotToken = '5929392146:AAHS1yHrs60imBpqv6Wl4Y3rGw0oGbeWllQ';

// Initialize OpenAI and TelegramBot instances
const openai = new OpenAI(openaiApiKey);
const bot = new TelegramBot(telegramBotToken, { polling: true });

// Listen for Telegram messages
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  // Construct the OpenAI API call
  const response = await openai.ChatCompletion.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content: 'You are a helpful assistant.' },
      { role: 'user', content: text },
    ],
  });

  // Extract the assistant's reply and send it as a Telegram message
  const assistantReply = response.choices[0].message.content;
  bot.sendMessage(chatId, assistantReply);
});

console.log('Telegram bot started...');
