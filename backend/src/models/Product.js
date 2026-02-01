const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    image: String,
    stock: Number,
    category: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
