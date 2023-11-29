require("dotenv").config();

const TelegramBot = require("node-telegram-bot-api");
const express = require("express");
const cors = require("cors");

const bot = new TelegramBot(process.env.TG_TOKEN || "", { polling: true });

const serverApp = express();

serverApp.use(express.json());
serverApp.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;

  if (!!msg.text) {
    switch (msg.text) {
      case "/start":
        await bot.sendMessage(chatId, "Have fun with", {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Pixpax",
                  web_app: {
                    url: process.env.APP_URL || "",
                  },
                },
              ],
            ],
          },
        });
        break;

      default:
        bot.sendMessage(chatId, "/start is what you need!");
        break;
    }
  }
});

serverApp.post("/bot-data", async (req, res) => {
  const {
    queryId,
    orderId,
    title,
    clientSupport,
    // order
  } = req.body;

  console.log(req.body);

  try {
    bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title,
      input_message_content: {
        message_text: `Заказ ${orderId}. \n ${clientSupport}`,
      },
    });

    return res.status(200).json({});
  } catch (error) {
    bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Ошибка!",
      input_message_content: {
        message_text: "Попробуйте позже",
      },
    });

    return res.status(500).json({});
  }
});

const PORT = 6006;
serverApp.listen(PORT, () => console.log(`server is up on port ${PORT}`));
