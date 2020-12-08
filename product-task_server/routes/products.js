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
  check("stock", "Event Location can not be empty!").not().isEmpty(),
];

router.post("/", verifyToken, validationChecks, function (req, res) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        Products.create(
          {
            title: req.body.title,
            price: req.body.price,
            stock: req.body.stock,
            user_id: req.body.user_id,
          },
          function (errormg, post) {
            if (errormg) return next(errormg);
            res.json({
              successMessage: "You have created a product successfully!",
              errMessage: false,
            });
          }
        );
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

router.delete("/:id", verifyToken, function (req, res, next) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;
        // Check if user_id of the event has been maliciously modified
        if (compareUserId == req.body.user_id) {
          Register.findById(compareUserId, async function (err, user) {
            if (err) return next(err);
            Products.findById(req.params.id, async function (err, product) {
              if (err) return next(err);
              const validateProductId = await product.user_id;
              // Check if this user is the user who created the event
              if (compareUserId == validateProductId) {
                Products.findByIdAndRemove(req.params.id, (error, data) => {
                  if (error) return next(error);
                  res.json("Event Has been deleted!");
                });
              } else {
                console.log("You are not permitted to delete this event!");
              }
            });
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

router.put("/:id", verifyToken, validationChecks, function (req, res) {
  jwt.verify(req.token, "secretkey", async (err, authData) => {
    if (err) {
      console.log("Unaothorized User");
      res.sendStatus(403);
    } else {
      try {
        const compareUserId = authData.user._id;
        // Check if user_id of the event has been maliciously modified
        if (compareUserId == req.body.user_id) {
          Register.findById(compareUserId, async function (err, user) {
            if (err) return err;

            Products.findById(req.params.id, async function (erro, product) {
              if (erro) return erro;

              const validateProductId = await product.user_id;

              // Check if this user is the user who created the event or is an admin
              if (compareUserId == validateProductId) {
                const errors = validationResult(req);
                if (!errors.isEmpty()) {
                  console.log(errors);

                  res.json(errors);
                } else {
                  Products.findByIdAndUpdate(
                    req.params.id,
                    {
                      title: req.body.title,
                      price: req.body.price,
                      stock: req.body.stock,
                    },
                    (error, data) => {
                      // if (error) return next(error);
                      if (error) return error;
                      res.json("Product Updated successfully!");
                    }
                  );
                }
              } else {
                console.log("You are not permitted to change this product!");
              }
            });
          });
        }
      } catch (e) {
        console.log(e);
        res.sendStatus(500);
      }
    }
  });
});

router.get("/:id", function (req, res, next) {
  Products.findById(req.params.id, function (err, post) {
    if (err) return next(err);
    res.json(post);
  });
});
module.exports = router;
