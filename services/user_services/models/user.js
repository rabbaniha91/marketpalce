const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    firstname: { type: String },
    lastname: { type: String },
    email: { type: String },
    verfiedEmail: { type: Boolean, required: true, default: false },
    phone: { type: String },
    verifiedPhone: { type: Boolean, required: true, default: false },
    password: { type: String },
    profilePicture: { type: String },
    role: {
      type: String,
      required: true,
      default: "user",
      enum: ["user", "admin", "seller"],
    },
    hasStore: { type: Boolean, default: false },
    stores: [{ type: mongoose.Types.ObjectId, ref: "Store" }],
    favorites: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
    refreshTokens: [String],
    birthDate: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);
module.exports = User;
