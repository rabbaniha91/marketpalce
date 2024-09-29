const mongoose = require("mongoose");

const notificationSchema = mongoose.Schema({
  title: { type: String, required: true },
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["read", "unread"], default: "unread" },
});

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
