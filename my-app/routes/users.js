var express = require("express");
var routerCtrl = require("../controllers/userCtrl");
var router = express.Router();

router.get("/", routerCtrl.login);

module.exports = router;
