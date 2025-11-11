const Users = require("../model/users");
const { bot } = require("./bot");
const {
  start,
  chooseLanguage,
  requestContact,
  logOut,
  chooseVacancy,
  addName,
  addWasBorn,
  addAddress,
  addPhoto,
  saveDate,
  changeLanguage,
} = require("./helper/start");

bot.on("message", async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  const findUser = await Users.findOne({ chat_id: chatId }).lean();
 

  if (text == "/start" || text == "🔙 Menu") {
    start(msg);
  }

  if (text == "/logout") {
    logOut(msg);
  }
  if (text == `🇷🇺/🇺🇿 Tilni o'zgartirish`) {
    changeLanguage(msg);
  }
    if (
      findUser &&
      text != "/start" &&
      text != "🔙 Menu" &&
      text != "/logout" &&
      text != `🇷🇺/🇺🇿 Tilni o'zgartirish`
    ) {
      if (findUser?.action == "choose_language") {
        chooseLanguage(msg);
      }

      if (findUser?.action == "choose_vacancy") {
        chooseVacancy(msg);
      }

      if (findUser?.action == "add_name") {
        addName(msg);
      }

      if (findUser?.action == "add_was_born") {
        addWasBorn(msg);
      }

      if (findUser?.action == "request_contact") {
        requestContact(msg);
      }

      if (findUser?.action == "add_address") {
        addAddress(msg);
      }

      if (findUser?.action == "ask_photo") {
        addPhoto(msg);
      }

      if (findUser?.action == "preview_data") {
        saveDate(msg);
      }
    }
});
