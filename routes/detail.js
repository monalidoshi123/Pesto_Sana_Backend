var express = require("express");
const DetailController = require("../controllers/DetailController");
const auth = require("../middlewares/jwt");

var router = express.Router();

router.get("/:id", auth.protect, DetailController.detail);

module.exports = router;
