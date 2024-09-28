const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    title: { type: String, required: true, text: true },
    category: { type: String, required: true, text: true },
    subCategory: { type: String, required: true, text: true },
    price: { type: Number, required: true },
    description: { type: String },
    pictures: [{ type: String }],
    inventory: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    brand: { type: String, text: true },
    ratings: [{ user: { type: mongoose.Types.ObjectId, ref: "User" }, rate: { type: Number, default: 0 } }],
    numberOfSales: { type: Number, default: 0 },
    store: { type: mongoose.Types.ObjectId, ref: "Store" },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
