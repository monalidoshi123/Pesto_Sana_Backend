var express = require("express");
var authRouter = require("./auth");
var detailRouter = require("./detail");

var app = express();

app.use("/auth/", authRouter);
app.use("/detail/", detailRouter);

module.exports = app;
