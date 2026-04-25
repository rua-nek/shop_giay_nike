const express = require("express");
const router = express.Router();

const indexRouter = require("./index");
const userRouter = require("./users");
const productRouter = require("./product");
const cartRouter = require("./cart");

// Sử dụng các router con

router.use("/cart", cartRouter);
router.use("/user", userRouter);
router.use("/product", productRouter);
router.use("/", indexRouter);

module.exports = router;
