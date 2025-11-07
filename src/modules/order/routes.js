const { Router } = require("express");
const order = require("./order");
const verify = require("../../middleware/verify");

const orderRoutes = Router();

orderRoutes
  .get("/order", verify, order.GET)
  .get("/order/:id", verify, order.GETONE)
  .post("/order", verify, order.CREATE)
  .patch("/order/:id", verify, order.UPDATE)
  .delete("/order/:id", verify, order.DELETE);

module.exports = orderRoutes;
