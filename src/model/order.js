const { Schema, model } = require("mongoose");

const Order = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },

    from: { type: String, required: true },
    to: { type: String, required: true },

    phone_number: { type: String, required: true },

    weight: { type: Number, required: true },

    pickupDate: { type: String, required: true }, // YYYY-MM-DD
    pickupTime: { type: String, required: true }, // HH:mm

    vehicleType: { type: String, required: true }, // car/truck etc
    vehicleBodyType: { type: String, required: true }, // sedan/van etc

    paymentType: { type: String, required: true }, // cash/card
    paymentAmount: { type: Number, required: true },
    paymentCurrency: { type: String, required: true },// usd/uzs etc
    messegeId: { type: Number },
    status:{ type: String, default: "1" } 
  
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

module.exports = model("Order", Order);
