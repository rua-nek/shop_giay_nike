var express = require("express");
var routerCtrl = require("../controllers/userCtrl");
var router = express.Router();

router.get("/register", routerCtrl.register);
router.post("/register", routerCtrl.registerPost);
router.post("/login", routerCtrl.loginPost);
router.get("/logout", routerCtrl.logout);
router.get("/", routerCtrl.login);

module.exports = router;
