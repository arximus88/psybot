require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const token = process.env.YOUR_TELEGRAM_BOT_TOKEN;
const weatherApiKey = process.env.OPEN_WEATHER_MAP_API_KEY;

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const bot = new TelegramBot(token, { polling: true });

async function generateResponse(message) {
  const prompt = message.text;
  const model = 'gpt-3.5-turbo';

  try {
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: model,
        messages: [{ role: 'system', content: 'You are a helpful gestalt psychotherapist assistant.' }, { role: 'user', content: prompt }],
        temperature: 0.8,
        max_tokens: 250,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    console.log('API response:', JSON.stringify(response.data, null, 2));

    const choices = response.data.choices;

    if (!choices || !choices[0]) {
      console.log('Unexpected API response:', response);
      return "Sorry, I couldn't generate a response. Please try again.";
    }

    const generatedText = choices[0].message.content || '';
    return generatedText.trim();
  } catch (error) {
    console.error('Error during API call:', error);
    return "Sorry, I couldn't generate a response. Please try again.";
  }
}

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const messageText = msg.text.toLowerCase();

  if (messageText === "/start") {
    bot.sendMessage(
      chatId,
      "Привіт! Я можу допомогти тобі перевірити погоду в Хмельницькому. Просто введи команду /checkweather. Якщо хочеш поговорити зі мною, то введи команду /chat."
    );
  } else if (messageText.startsWith("/checkweather")) {
    const city = "Khmelnytskyi";
    const country = "UA";
    const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${weatherApiKey}&units=metric&lang=uk`;

    axios
      .get(weatherApiUrl)
      .then((response) => {
        const weatherData = response.data;
        const temperature = weatherData.main.temp;
        const description = weatherData.weather[0].description;
        const message = `Погода в Хмельницькому прям зараз: ${description}, температура: ${temperature}°C.`;

        bot.sendMessage(chatId, message);
      })
      .catch((error) => {
        console.log(error);
        bot.sendMessage(chatId, "Ой! Щось пішло не так. Спробуй ще раз.");
      });
  } else {
    const mentionPattern = /@ThePsyBot/i;
    const mentionDetected = mentionPattern.test(messageText);

    if (mentionDetected) {
      const prompt = messageText.replace(mentionPattern,'').trim();
        const response = await generateResponse({ text: prompt });
        bot.sendMessage(chatId, response);
      }
    }
  });
  
  console.log("ThePsyBot is running!");
  