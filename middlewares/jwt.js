/*const jwt = require("express-jwt");
const secret = process.env.JWT_SECRET;

const authenticate = jwt({
	secret: secret
});

module.exports = authenticate;*/

const jwt = require("jsonwebtoken");
const apiResponse = require("../helpers/apiResponse");

exports.protect = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if no token
  if (!token) {
    return apiResponse.unauthorizedResponse(res, "Missing Token");
  }

  //Verify token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = decoded;
    next();
  } catch (ex) {
    apiResponse.unauthorizedResponse(res, "Invalid Token");
  }
};
