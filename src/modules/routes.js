const express = require("express");
const auth = require("./auth/routes");
const applicationRoutes = require("./order/routes");

const router = express.Router();

router.use("/v1", auth, applicationRoutes);

module.exports = router;


