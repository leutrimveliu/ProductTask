const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title required"],
  },
  price: {
    type: Number,
    required: [true, "Price required"],
  },
  publishDate: {
    type: Date,
    required: [true, "Card Number required"],
    default: Date.now,
  },
  stock: {
    type: Number,
    required: [true, "Stock required"],
  },
});
module.exports = mongoose.model("Products", productSchema);
