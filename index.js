require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');
const token = process.env.YOUR_TELEGRAM_BOT_TOKEN;
const weatherApiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

const bot = new TelegramBot(token, { polling: true });

bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toLowerCase();

  if (messageText === '/start') {
    bot.sendMessage(chatId, 'Привіт! Я можу допомогти тобі перевірити погоду в Хмельницькому. Просто введи команду /checkweather.');
  } else if (messageText.startsWith('/checkweather')) {
    const city = 'Khmelnytskyi';
    const country = 'UA';
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${weatherApiKey}&units=metric&lang=uk`;

    axios.get(weatherApiUrl)
      .then((response) => {
        const weatherData = response.data;
        const temperature = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const message = `Погода в Хмельницькому прям зараз: ${description}, температура: ${temperature}°C.`;

        bot.sendMessage(chatId, message);
      })
      .catch((error) => {
        console.log(error);
        bot.sendMessage(chatId, 'Ой! Щось пішло не так. Спробуй ще раз.');
      });
  }
});

console.log('ThePsyBot is running!');
