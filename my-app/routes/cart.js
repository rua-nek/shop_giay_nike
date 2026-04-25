const express = require("express");
const router = express.Router();
const cartCtrl = require("../controllers/cartCtrl");

router.post("/add", cartCtrl.addToCart);
router.get("/", cartCtrl.viewCart);

module.exports = router;
