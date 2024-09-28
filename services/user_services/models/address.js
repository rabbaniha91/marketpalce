const mongoose = require("mongoose");

const addressSchema = mongoose.Schema(
  {
    province: { type: String, required: true },
    township: { type: String, required: true },
    city: { type: String, required: true },
    details: { type: String, required: true },
  },
  { timestamps: true }
);

const Address = mongoose.model("Address", addressSchema);
module.exports = Address;
