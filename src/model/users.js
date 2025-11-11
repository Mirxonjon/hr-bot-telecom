const { Schema, model } = require("mongoose");

const Users = new Schema({
  chat_id: String,
  action: String,
  username: String,
  password: String,
  language: String,
  full_name: String,
  was_born: String,
  phone: String,
  address: String,
  IsStudent: Boolean,
  language_ru: String,
  language_uz: String,
  language_en: String,
  computer: String,
  image: String,
  experience: String,
  resume: String,
  vacancy: String,
  updateAt: Date,
  createdAt: Date,
});

module.exports = model("Users", Users);
