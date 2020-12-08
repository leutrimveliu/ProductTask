const User = require("../models/User");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    let user = await User.findOne({ email, password });

    if (!user) {
      res.status(400).send({ message: "Username or password is incorrect!" });
      return;
    }

    function generateAccessToken(user) {
      return jwt.sign(user, "secretkey", { expiresIn: "180m" });
    }
    const token = generateAccessToken({ user: user });
    res.json({ token: token, user: user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
