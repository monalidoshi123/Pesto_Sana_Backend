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
              "/?token=" +
              process.env.API_TOKEN,
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
