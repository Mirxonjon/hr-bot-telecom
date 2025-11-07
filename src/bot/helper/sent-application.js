const { bot } = require("../bot");
const Users = require("../../model/users");
const {
  adminKeyboardUZ,
  adminKeyboardRu,
  userKeyboardUz,
  userKeyboardRu,
} = require("../menu/keyboard");

const sentOrderToChanel = async (text) => {
  const CHANNEL_ID = "-1003193144547";
  const message = await bot.sendMessage(CHANNEL_ID, text);
  return message;
};

const updateOrderInChannel = async (messageId, newText) => {
  const CHANNEL_ID = "-1003193144547";

  const message = await bot.editMessageText(newText, {
    chat_id: CHANNEL_ID,
    message_id: messageId,
  });

  return message;
};

const deleteOrderMessage = async (messageId) => {
  const CHANNEL_ID = "-1003193144547";

  try {
    await bot.deleteMessage(CHANNEL_ID, messageId);
    console.log(`Message ${messageId} deleted successfully`);
    return true;
  } catch (error) {
    console.error("Error deleting message:", error);
    return false;
  }
};

module.exports = {
  sentOrderToChanel,
  updateOrderInChannel,
  deleteOrderMessage,
};
