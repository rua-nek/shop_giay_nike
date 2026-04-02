const express = require("express");
const router = express.Router();

const indexRouter = require("./index");

// Sử dụng các router con

router.use("/", indexRouter);

module.exports = router;
