var express = require("express");
const AuthController = require("../controllers/AuthController");
const auth = require("../middlewares/jwt");

var router = express.Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);
router.get("/login", auth.protect, AuthController.auth);
router.get("/detail/:id", AuthController.detail);

module.exports = router;
