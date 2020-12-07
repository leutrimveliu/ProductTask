var Register = require("../models/User");
var express = require("express");
var mongoose = require("mongoose");
const bodyParser = require("body-parser");
var router = express.Router();
const jwt = require("jsonwebtoken");
const { validationResult, check } = require("express-validator");

function verifyToken(req, res, next) {
  // Get auth header value
  const bearerHeader = req.headers["authorization"];
  // Check if bearer is undefined
  if (typeof bearerHeader !== "undefined") {
    // Split at the space
    const bearer = bearerHeader.split(" ");
    // Get token from array
    const bearerToken = bearer[1];
    // Parse token
    const showToken = JSON.parse(bearerToken);
    // Set the token
    req.token = showToken.token;
    // Next middleware
    next();
  } else {
    // Forbidden
    res.sendStatus(403);
  }
}

router.post(
  "/",

  [
    check("firstName", "Name must be as least 3 characters long!").isLength({
      min: 3,
    }),
  ],
  [
    check("lastName", "Last Name must be at least 3 characters long!").isLength(
      {
        min: 3,
      }
    ),
  ],
  [
    check("email", "Email must contain @ and 3 characters long!")
      .isLength()
      .isEmail({
        min: 3,
      }),
  ],

  [
    check("password", "Password must be at least 6 characters long!").isLength({
      min: 7,
      max: 20,
    }),
  ],

  async function (req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        console.log(errors);
        res.json(errors);
      } else {
        const email = req.body.email;
        let user = await Register.findOne({ email });
        if (user) {
          // res.json("This email already exists!");
          res.json({
            successMessage: false,
            errMessage: "This email already exists!",
          });

          return;
        } else {
          const dataBody = {
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            email: req.body.email,
            password: req.body.password,
          };
          Register.create(dataBody, function (err, post) {
            if (err) return next(err);
            // res.json("You have been registred successfully!");
            res.json({
              successMessage: "You have been registred successfully!",
              errMessage: false,
            });
            return;
          });
        }
      }
    } catch (e) {
      console.log(e);
      res.sendStatus(500);
    }
  }
);

module.exports = router;
