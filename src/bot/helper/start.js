const { bot } = require("../bot");
const Users = require("../../model/users");
const {
  adminKeyboardUZ,
  adminKeyboardRu,
  userKeyboardUz,
  userKeyboardRu,
} = require("../menu/keyboard");
const start = async (msg) => {
  const chatId = msg.from.id;

  let checkUser = await Users.findOne({ chat_id: chatId }).lean();

  if (checkUser?.language && checkUser?.phone) {
    await Users.findByIdAndUpdate(
      checkUser._id,
      { ...checkUser, action: "menu" },
      { new: true }
    );

    bot.sendMessage(
      chatId,
      checkUser.language == "uz" ? `Menyuni tanlang` : `Выберите меню`,
      {
        reply_markup: {
          keyboard: checkUser.admin
            ? checkUser.language == "uz"
              ? adminKeyboardUZ
              : adminKeyboardRu
            : checkUser.language == "uz"
            ? userKeyboardUz
            : userKeyboardRU,
          resize_keyboard: true,
        },
      }
    );
  } else if (!checkUser) {
    let newUser = new Users({
      chat_id: chatId,
      admin: false,
      createdAt: new Date(),
      action: "choose_language",
    });
    await newUser.save();
    const url =
      "https://marketing.uz/brend-goda-2021/uploads/works/covers/3367084b181cb4ff62d8c85bebe1958b.jpg";
    await bot.sendPhoto(chatId, url, {
      parse_mode: "HTML",
      caption: `
          <b>  Объявляется вакансия на должность
«Оператор Call-Центра» в Службе по
предоставлению услуг аутсорсинга! </b>

<b>Особые требование:</b>
✅ Навыки работы на ПК:  Windows, MS Office, оргтехникой;
✅ Быстрая печать на клавиатуре;
✅ Свободное владение русским и узбекским языком;
(грамматика и устная речь);
✅ Возраст: от 18 до 35 лет;
🕗 График работы 5/2; 
💸 Заработная плата: ~3 600 000;

<b>Удобства:</b>
✅ Официальная работа в офисе;
✅ Надбавки;
✅ Дружелюбный коллектив;
✅ Карьерный рост;
📍 Адрес: <a href="https://yandex.uz/maps/10335/tashkent/house/YkAYdAFoTkMPQFprfX55dHxmYQ==/?ll=69.268479%2C41.284929&z=19"> г.Ташкент, Мирабадский р-он, ул.Нукус 87. Ориентир
посольства России</a>;`,
    });

    await bot.sendMessage(
      chatId,
      `Здравствуйте  ${msg.from.first_name},  добро пожаловать в наш бот. Выберите язык 🇷🇺/🇺🇿`,
      {
        reply_markup: {
          keyboard: [["🇷🇺  Русский", `🇺🇿 O'zbekcha`]],
          resize_keyboard: true,
        },
      }
    );
  }
};

const chooseLanguage = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  let user = await Users.findOne({ chat_id: chatId }).lean();
  console.log("user", user);
  if (`🇺🇿 O‘zbekcha` == text || `🇷🇺  Русский` == text) {
    user.language = text == `🇺🇿 O‘zbekcha` ? "uz" : "ru";
    user.action = "choose_vacancy";

    await Users.findByIdAndUpdate(user._id, user, { new: true });
    bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `💼 Sizni qiziqtirgan vakansiyani tanlang`
        : `💼 Выберите интересующую Вас вакансию`,
      {
        reply_markup: {
          keyboard: [
            [
              user.language == "uz"
                ? `Aloqa markazi operatori`
                : "Оператор Call-центра",
              "🇷🇺/🇺🇿 Tilni o'zgartirish",
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } else {
    bot.sendMessage(chatId, `Выберите язык 🇷🇺/🇺🇿`, {
      reply_markup: {
        keyboard: [
          [
            {
              text: `🇺🇿 O‘zbekcha`,
            },
            {
              text: `🇷🇺  Русский`,
            },
          ],
        ],
        resize_keyboard: true,
      },
    });
  }
};

const chooseVacancy = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  let user = await Users.findOne({ chat_id: chatId }).lean();
  console.log("user", user);
  if ("Оператор Call-центра" == text || `Aloqa markazi operatori` == text) {
    user.action = "add_name";
    user.vacancy = `operator`;
    await Users.findByIdAndUpdate(user._id, user, { new: true });
    bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `👤 Toʻliq ismingizni kiriting (masalan: Mahmudov Alisher Baxodir o'g'li)`
        : `👤Введите ФИО  (пример: Иванов Иван Иванович)`,
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  } else {
    bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `💼 Sizni qiziqtirgan vakansiyani tanlang`
        : `💼 Выберите интересующую Вас вакансию`,
      {
        reply_markup: {
          keyboard: [
            [
              user.language == "uz"
                ? `Aloqa markazi operatori`
                : "Оператор Call-центра",
              "🇷🇺/🇺🇿 Tilni o'zgartirish",
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  }
};

const addName = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text;
  let user = await Users.findOne({ chat_id: chatId }).lean();
  console.log("user", user);
  const forbiddenRegex = /[.,\/\\]/g;
  const parts = text.split(" ").filter(Boolean);
  if (!forbiddenRegex.test(text) && parts.length >= 3) {
    user.action = "add_was_born";
    user.full_name = text;
    await Users.findByIdAndUpdate(user._id, user, { new: true });
    bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `📅 Tug'ilgan kuningizni kiriting (masalan, dd.mm.yyyy)`
        : "📅 Укажите дату своего рождения (пример: дд.мм.гггг)",
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  } else {
    bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `👤 Toʻliq ismingizni kiriting (masalan: Mahmudov Alisher Baxodir o'g'li)`
        : `👤Введите ФИО  (пример: Иванов Иван Иванович)`,
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  }
};

const addWasBorn = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text.trim();
  let user = await Users.findOne({ chat_id: chatId }).lean();
  console.log("user", user);

  // 🎯 dd.mm.yyyy format tekshiruv
  const birthRegex =
    /^(0[1-9]|[12][0-9]|3[01])\.(0[1-9]|1[0-2])\.(19\d{2}|20\d{2})$/;

  if (birthRegex.test(text)) {
    // ✅ To'g'ri format → saqlaymiz
    user.action = "request_contact";
    user.was_born = text;

    await Users.findByIdAndUpdate(user._id, user, { new: true });

    return bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `📱 Telefon raqamingizni kiriting (masalan: +998XXXXXXXXX)`
        : `📱 Укажите Ваш контактный номер телефона (пример: +998XXXXXXXXX)`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text:
                  user.language == "uz"
                    ? "📱 Raqamni yuborish"
                    : "📱 Отправить номер",
                request_contact: true,
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  } else {
    bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `📅 Tug'ilgan kuningizni kiriting (masalan, dd.mm.yyyy)`
        : "📅 Укажите дату своего рождения (пример: дд.мм.гггг)",
      {
        reply_markup: {
          remove_keyboard: true,
        },
      }
    );
  }
};

const requestContact = async (msg) => {
  const chatId = msg.from.id;
  let phonetext = msg.text;
  let user = await Users.findOne({ chat_id: chatId }).lean();
  const username = msg?.from?.username;
  console.log(phonetext);
  if (msg?.contact?.phone_number || phonetext) {
    if (msg?.contact?.phone_number) {
      phonetext = `+${+msg?.contact?.phone_number}`;
    }
    console.log(phonetext, msg?.contact?.phone_number, "2 chi");

    if (
      phonetext?.includes("+99") &&
      !isNaN(+phonetext.split("+99")[1]) &&
      phonetext.length >= 13
    ) {
      user.phone = phonetext;
      user.action = "add_address";
      user.username = username?.toLowerCase();
      await Users.findByIdAndUpdate(user._id, user, { new: true });

      bot.sendMessage(
        chatId,
        user.language == "uz"
          ? `🏠 Yashash manzili (shahar, tuman, ko'cha/blok)`
          : "🏠 Адрес проживания (пример: город, район, улица/квартал)",
        {
          reply_markup: {
            remove_keyboard: true,
          },
        }
      );
    } else {
      return bot.sendMessage(
        chatId,
        user.language == "uz"
          ? `📱 Telefon raqamingizni kiriting (masalan: +998XXXXXXXXX)`
          : `📱 Укажите Ваш контактный номер телефона (пример: +998XXXXXXXXX)`,
        {
          reply_markup: {
            keyboard: [
              [
                {
                  text:
                    user.language == "uz"
                      ? "📱 Raqamni yuborish"
                      : "📱 Отправить номер",
                  request_contact: true,
                },
              ],
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    }
  } else {
    return bot.sendMessage(
      chatId,
      user.language == "uz"
        ? `📱 Telefon raqamingizni kiriting (masalan: +998XXXXXXXXX)`
        : `📱 Укажите Ваш контактный номер телефона (пример: +998XXXXXXXXX)`,
      {
        reply_markup: {
          keyboard: [
            [
              {
                text:
                  user.language == "uz"
                    ? "📱 Raqamni yuborish"
                    : "📱 Отправить номер",
                request_contact: true,
              },
            ],
          ],
          resize_keyboard: true,
          one_time_keyboard: true,
        },
      }
    );
  }
};

const addAddress = async (msg) => {
  const chatId = msg.from.id;
  const text = msg.text.trim();
  let user = await Users.findOne({ chat_id: chatId }).lean();
  console.log("user", user);

  user.action = "ask_student";
  user.was_born = text;

  await Users.findByIdAndUpdate(user._id, user, { new: true });

  return bot.sendMessage(
    chatId,
    user.language == "uz" ? `Siz talabamisiz?` : "👨‍🎓Вы являетесь студентом?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "✅ДА",
              callback_data: `student_yes`,
            },
            {
              text: "❌НЕТ",
              callback_data: `student_no`,
            },
          ],
        ],
        one_time_keyboard: true,
      },
    }
  );
};

const askStudent = async (query) => {
  const chatId = query.from.id;
  const callback = query.data; // student::yes  yoki student::no

  let user = await Users.findOne({ chat_id: chatId });

  const [, value] = callback.split("_");
  user.IsStudent = value === "yes";
  user.action = "ask_language_uz";
  await user.save();

  await bot.sendMessage(
    chatId,
    user.lang == "uz"
      ? `🇺🇿 O'zbek tilini bilish darajangiz qanday?`
      : "🇺🇿 Какой у вас уровень узбекского языка?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "1: Начальный",
              callback_data: `langUz_beginner`,
            },
            {
              text: "2: Средний",
              callback_data: `langUz_middle`,
            },
          ],
          [
            {
              text: "3: Продвинутый",
              callback_data: `langUz_advanced`,
            },
            {
              text: "4: Свободный",
              callback_data: `langUz_fluent`,
            },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
};

const askLangUz = async (query) => {
  const chatId = query.from.id;
  const callback = query.data;

  let user = await Users.findOne({ chat_id: chatId });

  const [, value] = callback.split("_");
  user.language_uz = value;
  user.action = "ask_language_ru";
  await user.save();

  await bot.sendMessage(
    chatId,
    user.lang == "uz"
      ? `🇷🇺 Rus tilini bilish darajangiz qanday?`
      : "🇷🇺 Какой у вас уровень русского языка?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "1: Начальный",
              callback_data: `langRu_beginner`,
            },
            {
              text: "2: Средний",
              callback_data: `langRu_middle`,
            },
          ],
          [
            {
              text: "3: Продвинутый",
              callback_data: `langRu_advanced`,
            },
            {
              text: "4: Свободный",
              callback_data: `langRu_fluent`,
            },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
};

const askLangRu = async (query) => {
  const chatId = query.from.id;
  const callback = query.data;

  let user = await Users.findOne({ chat_id: chatId });

  const [, value] = callback.split("_");
  user.language_ru = value;
  user.action = "ask_language_en";
  await user.save();

  await bot.sendMessage(
    chatId,
    user.lang == "uz"
      ? `🇺🇸 Ingliz tilini bilish darajangiz qanday?`
      : "🇺🇸 Какой у вас уровень англиский языка?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "1: Начальный",
              callback_data: `langEn_beginner`,
            },
            {
              text: "2: Средний",
              callback_data: `langEn_middle`,
            },
          ],
          [
            {
              text: "3: Продвинутый",
              callback_data: `langEn_advanced`,
            },
            {
              text: "4: Свободный",
              callback_data: `langEn_fluent`,
            },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
};

const askLangEn = async (query) => {
  const chatId = query.from.id;
  const callback = query.data;

  let user = await Users.findOne({ chat_id: chatId });

  const [, value] = callback.split("_");
  user.language_en = value;
  user.action = "ask_computer";
  await user.save();

  await bot.sendMessage(
    chatId,
    user.lang == "uz"
      ? `💻 Kompyuterni bilish darajangiz qanday?`
      : "💻 Какой у вас уровень знания компьютера?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "1: Начальный",
              callback_data: `comp_beginner`,
            },
            {
              text: "2: Средний",
              callback_data: `comp_middle`,
            },
          ],
          [
            {
              text: "3: Продвинутый",
              callback_data: `comp_advanced`,
            },
            {
              text: "4: Свободный",
              callback_data: `comp_fluent`,
            },
          ],
        ],
        one_time_keyboard: true,
        resize_keyboard: true,
      },
    }
  );
};

const askComputer = async (query) => {
  const chatId = query.from.id;
  const callback = query.data;

  let user = await Users.findOne({ chat_id: chatId });

  const [, value] = callback.split("_");
  user.computer = value;
  user.action = "ask_experience";
  await user.save();

  await bot.sendMessage(
    chatId,
    user.lang == "uz"
      ? `💼 Sizning ish tajribangiz qanday?`
      : "💼 Ваш опыт работы?",
    {
      reply_markup: {
        inline_keyboard: [
          [
            {
              text: "0-6мес",
              callback_data: `experience_0-6m`,
            },
            {
              text: "6мес-1год",
              callback_data: `experience_6m-1y`,
            },
          ],
          [
            {
              text: "1год-3год",
              callback_data: `experience_1y-3y`,
            },
            {
              text: "3год+",
              callback_data: `experience_3y+`,
            },
          ],
        ],
        one_time_keyboard: true,
      },
    }
  );
};

const askExperince = async (query) => {
  const chatId = query.from.id;
  const callback = query.data;

  let user = await Users.findOne({ chat_id: chatId });

  const [, value] = callback.split("_");
  user.experience = value;
  user.action = "ask_photo";
  await user.save();

  await bot.sendMessage(
    chatId,
    user.lang == "uz"
      ? "🤵/🤵‍♀️ Suratingizni yuboring (telefoningizda selfi olishingiz mumkin)"
      : "🤵/🤵‍♀️ Отправьте Ваше фото (можно селфи с телефона)",
    {
      reply_markup: {
        remove_keyboard: true,
      },
    }
  );
};

const addPhoto = async (msg) => {
  // const chatId = msg.from.id;
  // const text = msg.text.trim();
  // let user = await Users.findOne({ chat_id: chatId }).lean();
  // console.log("user", user);

  // user.action = "ask_student";
  // user.was_born = text;

  // await Users.findByIdAndUpdate(user._id, user, { new: true });

  // return bot.sendMessage(
  //   chatId,
  //   user.language == "uz" ? `Siz talabamisiz?` : "👨‍🎓Вы являетесь студентом?",
  //   {
  //     reply_markup: {
  //       inline_keyboard: [
  //         [
  //           {
  //             text: "✅ДА",
  //             callback_data: `student_yes`,
  //           },
  //           {
  //             text: "❌НЕТ",
  //             callback_data: `student_no`,
  //           },
  //         ],
  //       ],
  //       one_time_keyboard: true,
  //     },
  //   }
  // );
};





const logOut = async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  try {
    const user = await Users.findOneAndDelete({ chat_id: userId });

    if (user) {
      await bot.sendMessage(
        chatId,
        "✅ Sizning hisobingiz muvaffaqiyatli o‘chirildi."
      );
    } else {
      await bot.sendMessage(chatId, "ℹ️ Siz avval ro‘yxatdan o‘tmagansiz.");
    }
  } catch (err) {
    console.error("Logout error:", err);
    await bot.sendMessage(
      chatId,
      "❌ Xatolik yuz berdi. Iltimos, keyinroq urinib ko‘ring."
    );
  }
};

module.exports = {
  start,
  chooseLanguage,
  requestContact,
  chooseVacancy,
  addName,
  addWasBorn,
  askStudent,
  askLangUz,
  askLangRu,
  askLangEn,
  askComputer,
  askExperince,
  addPhoto,
  logOut,
  addAddress,
};
