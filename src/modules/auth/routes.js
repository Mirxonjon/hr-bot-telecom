const { Router } = require("express");
const auth = require("./auth");

const authRoutes = Router();

authRoutes
  .get("/admin", auth.GET)
  .post("/login", auth.POST)
  .post("/register", auth.REGISTER);

module.exports = authRoutes;
