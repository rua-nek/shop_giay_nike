const express = require("express");
const router = express.Router();

const indexRouter = require("./index");
const userRouter = require("./users");

// Sử dụng các router con

router.use("/user", userRouter);
router.use("/", indexRouter);

module.exports = router;
