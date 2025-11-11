const Users = require("../model/users");
const { bot } = require("./bot");

const {
  askStudent,
  askLangUz,
  askLangRu,
  askLangEn,
  askComputer,
  askExperince,
} = require("./helper/start");

bot.on("callback_query", async (query) => {
  const chatId = query.from.id;

  const { data } = query;
  let callbackName = data.split("_");

  bot
    .answerCallbackQuery(query.id, {
      show_alert: false,
      cache_time: 0.5,
    })
    .then(async () => {
      if (callbackName[0] == "student") {
        askStudent(query);
      }

      if (callbackName[0] == "langUz") {
        askLangUz(query);
      }

      if (callbackName[0] == "langRu") {
        askLangRu(query);
      }

      if (callbackName[0] == "langEn") {
        askLangEn(query);
      }

      if (callbackName[0] == "comp") {
        askComputer(query);
      }

      if (callbackName[0] == "experience") {
        askExperince(query);
      }
    })
    .catch((e) => {
      console.log(e.message);
    });
});
