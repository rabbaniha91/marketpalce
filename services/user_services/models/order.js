const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    store: { type: mongoose.Types.ObjectId, ref: "Store" },
    state: {
      type: String,
      enum: ["pending", "completed", "failed", "shipped", "canceled"],
      default: "pending",
    },
    transaction: { type: mongoose.Types.ObjectId, ref: "Transaction" },
    totalPrice: { type: Number, required: true },
    shippingAddress: { type: mongoose.Types.ObjectId, ref: "Address" },
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
