const youtubedl = require("youtube-dl");
const TelegramBot = require("node-telegram-bot-api");

// Create a bot that uses 'polling' to fetch new updates
const token = '5888623895:AAHUgaZIgU9oYKgBaN9fp9ESjvw2xaM29ik';

const bot = new TelegramBot(token, {polling: true});


bot.on("message", (msg) => {
  if (msg.text === "/start") {
    bot.sendMessage(
      msg.chat.id,
      `مرحبا, ${msg.chat.first_name} أرسل رابط يوتيوب وسوف يتحول لرابط مباشر `
    );
  } else {
    getInfo(msg);
  }
});

const getInfo = (msg) => {
  youtubedl.getInfo(
    msg.text,
    ["--username=user", "--password=hunter2"],
    function (err, info) {
      if (err) {
        bot.sendMessage(msg.chat.id, err.message);
      }
      bot.sendPhoto(msg.chat.id, info.thumbnail, {
        caption: info.title,
        reply_markup: {
          inline_keyboard: [
            ...info.formats
              .map((format) => {
                if (
                  format.acodec === "none" ||
                  (format.vcodec === "none" && format.format_id !== "251")
                )
                  return null;

                return [
                  {
                    text: format.format,
                    url: format.url,
                    callback_data: "1",
                  },
                ];
              })
              .filter((key) => !!key),
          ],
        },
      });
    }
  );
};
