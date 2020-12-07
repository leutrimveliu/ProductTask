const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const config = require("./config/DB");
const products = require("./routes/products");
const register = require("./routes/user-register");
const login = require("./routes/auth");

mongoose.Promise = global.Promise;
mongoose
  .connect(config.DB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(5000);
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());
app.use("/user-register", register);
app.use("/auth", login);
app.use("/products", products);

var port = process.env.PORT || 4000;

app.listen(port, function () {
  console.log("NodeJS Server Port: ", port);
});
