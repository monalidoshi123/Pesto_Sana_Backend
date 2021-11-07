var express = require("express");
const AuthController = require("../controllers/AuthController");
const auth = require("../middlewares/jwt");

var router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/loaduser", auth.protect, AuthController.loaduser);

module.exports = router;
