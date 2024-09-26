const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  firstname: { type: String },
  lastname: { type: String },
  username: { type: String, required: true, unique: true },
  email: { type: String, unique: true },
  verfiedEmail: { type: Boolean, required: true, default: false },
  phone: { type: String, unique: true },
  verifiedPhone: { type: Boolean, required: true, default: false },
  password: { type: String },
  profilePicture: { type: String },
  role: {
    type: String,
    required: true,
    default: "user",
    enum: ["user", "admin", "seller"],
  },
  address: [{ type: mongoose.Types.ObjectId, ref: "Address" }],
  hasStore: { type: Boolean, default: false },
  stores: [{ type: mongoose.Types.ObjectId, ref: "Store" }],
  favorites: [{ type: mongoose.Types.ObjectId, ref: "Product" }],
});

const User = mongoose.model("User", userSchema);
module.exports = User;
