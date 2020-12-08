const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, "Title required"],
  },
  price: {
    type: Number,
    required: [true, "Price required"],
    get: getPrice,
    set: setPrice,
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
function getPrice(num) {
  return (num / 100).toFixed(2);
}

function setPrice(num) {
  return num * 100;
}
module.exports = mongoose.model("Products", productSchema);
