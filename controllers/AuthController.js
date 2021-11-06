const UserModel = require("../models/UserModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
//helper file to prepare responses.
const apiResponse = require("../helpers/apiResponse");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var request = require("request");
var mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 * @param {string}      location
 * @param {string}      threshold
 *
 * @returns {Object}
 */
exports.register = [
  // Validate fields.
  body("firstName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("First name must be specified.")
    .isAlphanumeric()
    .withMessage("First name has non-alphanumeric characters."),
  body("lastName")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Last name must be specified.")
    .isAlphanumeric()
    .withMessage("Last name has non-alphanumeric characters."),
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address.")
    .custom((value) => {
      return UserModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
  body("password")
    .isLength({ min: 6 })
    .trim()
    .withMessage("Password must be 6 characters or greater."),
  // Sanitize fields.
  sanitizeBody("firstName").escape(),
  sanitizeBody("lastName").escape(),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape(),
  // Process request after validation and sanitization.
  (req, res) => {
    try {
      // Extract the validation errors from a request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        // Display sanitized values/errors messages.
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        //hash input password
        bcrypt.hash(req.body.password, 10, function (err, hash) {
          // Create User object with escaped and trimmed data
          var user = new UserModel({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: hash,
            location: req.body.location,
            threshold: req.body.threshold,
          });
          user.save(function (err) {
            if (err) {
              return apiResponse.ErrorResponse(res, err);
            }
            let userData = {
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              location: req.body.location,
              threshold: req.body.threshold,
            };
            //Prepare JWT token for authentication
            const jwtPayload = userData;
            const jwtData = {
              expiresIn: process.env.JWT_TIMEOUT_DURATION,
            };
            const secret = process.env.JWT_SECRET_KEY;
            //Generated JWT token with Payload and secret.
            userData.token = jwt.sign(jwtPayload, secret, jwtData);

            return apiResponse.successResponseWithData(
              res,
              "Registration Success.",
              userData
            );
          });
        });
      }
    } catch (err) {
      //throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
  body("email")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Email must be specified.")
    .isEmail()
    .withMessage("Email must be a valid email address."),
  body("password")
    .isLength({ min: 1 })
    .trim()
    .withMessage("Password must be specified."),
  sanitizeBody("email").escape(),
  sanitizeBody("password").escape(),
  (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return apiResponse.validationErrorWithData(
          res,
          "Validation Error.",
          errors.array()
        );
      } else {
        UserModel.findOne({ email: req.body.email }).then((user) => {
          if (user) {
            //Compare given password with db's hash.
            bcrypt.compare(
              req.body.password,
              user.password,
              function (err, same) {
                if (same) {
                  let userData = {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    location: user.location,
                    threshold: user.threshold,
                  };
                  //Prepare JWT token for authentication
                  const jwtPayload = userData;
                  const jwtData = {
                    expiresIn: process.env.JWT_TIMEOUT_DURATION,
                  };
                  const secret = process.env.JWT_SECRET_KEY;
                  //Generated JWT token with Payload and secret.
                  userData.token = jwt.sign(jwtPayload, secret, jwtData);
                  return apiResponse.successResponseWithData(
                    res,
                    "Login Success.",
                    userData
                  );
                } else {
                  return apiResponse.unauthorizedResponse(
                    res,
                    "Email or Password wrong."
                  );
                }
              }
            );
          } else {
            return apiResponse.unauthorizedResponse(
              res,
              "Email or Password wrong."
            );
          }
        });
      }
    } catch (err) {
      return apiResponse.ErrorResponse(res, "Invalid Credentials");
    }
  },
];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.auth = [
  async function (req, res) {
    console.log(req.user._id);
    try {
      UserModel.findById(req.user._id).then((user) => {
        return apiResponse.successResponseWithData(
          res,
          "Operation success",
          user
        );
      });
    } catch (err) {
      return apiResponse.ErrorResponse(res, err);
    }
  },
];

/**
 * User Detail.
 *
 * @param {string}      id
 *
 * @returns {Object}
 */
exports.detail = [
  function (req, res) {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return apiResponse.validationErrorWithData(res);
    }
    try {
      UserModel.findOne({ _id: req.params.id }).then((user) => {
        if (user !== null) {
          request(
            "https://api.waqi.info/feed/" +
              user.location +
              "/?token=358a69c811636744996183516009b032ddd74948",
            function (error, response, body) {
              if (!error && response.statusCode === 200) {
                body = JSON.parse(body);
                let userData = {
                  _id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  email: user.email,
                  location: user.location,
                  threshold: user.threshold,
                };
                userData.aqi = body.data.aqi;
                userData["level"] =
                  body.data.aqi > user.threshold ? "higher" : "lower";
                return apiResponse.successResponseWithData(
                  res,
                  "Operation success",
                  userData
                );
              }
            }
          );
        } else {
          return apiResponse.notFoundResponse(res);
        }
      });
    } catch (err) {
      // Throw error in json response with status 500.
      return apiResponse.ErrorResponse(res, err);
    }
  },
];