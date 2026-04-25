var express = require("express");
var routerCtrl = require("../controllers/productCtrl");
var router = express.Router();

router.get("/detail/:slug", routerCtrl.detail);
router.get("/", routerCtrl.index);

module.exports = router;
