const mongoose = require("mongoose");

const transactionSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed", "canceled"],
      default: "pending",
    },
    paymentMethod: {
      type: String,
      enum: ["credit_card", "paypal", "wallet", "bank_transfer"],
      required: true,
    },
    transactionId: { type: String },
    order: { type: mongoose.Types.ObjectId, ref: "Order" },
    createdAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
module.exports = Transaction;
