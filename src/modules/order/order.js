const { Errorhandler } = require("../../exseptions/ErrorHandler");
const { sign } = require("../../utils/jwt");
const Users = require("../../model/users");
const {
  updateOrderInChannel,
  deleteOrderMessage,
  sentOrderToChanel,
} = require("../../bot/helper/sent-application");
const order = require("../../model/order");

module.exports = {
  async GET(req, res, next) {
    try {
      const findOrders = await order
        .find({ status: "1" })
        .sort({ createdAt: -1 });

      res.status(200).json({
        message: "Orders fetched successfully",
        status: 200,
        data: findOrders,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async GETONE(req, res, next) {
    try {
      const { id } = req.params;
      const findOrder = await order.findOne({ status: "1", _id: id });

      res.status(200).json({
        message: "Orders fetched successfully",
        status: 200,
        data: findOrder,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async CREATE(req, res, next) {
    try {
      const {
        description,
        from,
        paymentAmount,
        paymentCurrency,
        paymentType,
        phone_number,
        pickupDate,
        pickupTime,
        title,
        to,
        vehicleBodyType,
        vehicleType,
        weight,
      } = req.body;

      const message = `
🇺🇿 ${from} => ${to} 🇺🇿
📦 Yuk: ${title}
⚖️ Og‘irligi: ${weight} tonna
🚛 Avto turi: ${vehicleType}
🚋 Pritsep turi: ${vehicleBodyType}
💰 To‘lov turi: ${paymentType == "cash" ? "naqd" : "karta"}
💸 Narxi: ${paymentAmount} ${paymentCurrency == "usd" ? "$" : "so'm"}
🕔 Yuklash vaqti: ${pickupDate} / ${pickupTime}
📝 Tavsif: ${description}

📞 Aloqa: ${phone_number}
`;
     console.log(message);
      const sentMessage = await sentOrderToChanel(message);

      const createOrder = order.create({
        description,
        from,
        paymentAmount,
        paymentCurrency,
        paymentType,
        phone_number,
        pickupDate,
        pickupTime,
        title,
        to,
        vehicleBodyType,
        vehicleType,
        weight,
        messegeId: sentMessage.message_id,
      });


      console.log(createOrder ,'sended to channel');
      res.status(200).json({
        message: "Yuk ma'lumoti Telegramga yuborildi ✅",
        status: 200,
        data: createOrder,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async UPDATE(req, res, next) {
    try {
      const {
        description,
        from,
        paymentAmount,
        paymentCurrency,
        paymentType,
        phone_number,
        pickupDate,
        pickupTime,
        title,
        to,
        vehicleBodyType,
        vehicleType,
        weight,
      } = req.body;
      const { id } = req.params;

      const message = `
🇺🇿 ${from} => ${to} 🇺🇿
📦 Yuk: ${title}
⚖️ Og‘irligi: ${weight} tonna
🚛 Avto turi: ${vehicleType}
🚋 Pritsep turi: ${vehicleBodyType}
💰 To‘lov turi: ${paymentType == "cash" ? "naqd" : "karta"}
💸 Narxi: ${paymentAmount} ${paymentCurrency == "usd" ? "$" : "so'm"}
🕔 Yuklash vaqti: ${pickupDate} / ${pickupTime}
📝 Tavsif: ${description}

📞 Aloqa: ${phone_number}
`;
      const findOrder = await order.findById(id);
           console.log(message , 'updated message');

      const sentMessage = await updateOrderInChannel(
        findOrder.messegeId,
        message
      );

      const Update = await order.findByIdAndUpdate(
        id,
        {
          description,
          from,
          paymentAmount,
          paymentCurrency,
          paymentType,
          phone_number,
          pickupDate,
          pickupTime,
          title,
          to,
          vehicleBodyType,
          vehicleType,
          weight,
        },
        { new: true }
      );

      res.status(200).json({
        message: "Yuk ma'lumoti yangilandi ✅",
        status: 200,
        data: Update,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },

  async DELETE(req, res, next) {
    try {
      const { id } = req.params;
      const findOrder = await order.findOne({ status: "1", _id: id });
      const updateOrder = await order.findByIdAndUpdate(
        {
          _id: findOrder._id,
        },
        {
          status: "0",
        }
      );

      const sentMessage = await deleteOrderMessage(findOrder.messegeId);

      res.status(200).json({
        message: "Order deleted successfully",
        status: 200,
        data: updateOrder,
      });
    } catch (error) {
      console.error(error);
      next(error);
    }
  },
};
