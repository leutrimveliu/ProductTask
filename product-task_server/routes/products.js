const Products = require("../models/Products");
const Register = require("../models/User");
const express = require("express");
const { validationResult, check } = require("express-validator");
const jwt = require("jsonwebtoken");
const router = express.Router();

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
router.get("/", function (req, res, next) {
  Products.find(function (err, product) {
    if (err) return next(err);
    res.json(product);
  });
});

const validationChecks = [
  check("title", "Title must be as least 3 characters long!").isLength({
    min: 3,
  }),
  check("price", "Event Category can not be empty!").not().isEmpty(),
  // check("publishDate", "Publish Datecan not be empty!").not().isEmpty(),
  check("stock", "Event Location can not be empty!").not().isEmpty(),
];
// router.post("/", function (req, res, next) {
//   Products.create(req.body, function (err, post) {
//     if (err) return next(err);
//     res.json(post);
//   });
// });

router.post("/", verifyToken, validationChecks, function (req, res) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;
        console.log(authData.user._id, req.body);

        // Check if user_id of the event has been maliciously modified
        if (compareUserId) {
          console.log("ka mrri");
          Register.findById(compareUserId, async function (err, product) {
            if (err) return err;
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
              console.log(errors);
              // res.json(errors);
              res.json({
                successMessage: false,
                errMessage: errors,
              });
            } else {
              const product = new Products({
                title: req.body.title,
                price: req.body.price,
                stock: req.body.stock,
              });

              await product.save();

              // res.json("file uploaded");
              res.json({
                successMessage: "You have created a product successfully!",
                errMessage: false,
              });
            }
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

module.exports = router;
