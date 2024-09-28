const mongoose = require("mongoose");

const chatSchema = mongoose.Schema(
  {
    store: { type: mongoose.Types.ObjectId, ref: "Store", required: true }, 
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true }, 
    chats: [
      {
        sender: { type: String, enum: ["user", "store"], required: true }, // فرستنده پیام: کاربر یا فروشنده
        message: { type: String, required: true },
        sentAt: { type: Date, default: Date.now }, // تاریخ و زمان ارسال پیام
      },
    ],
  },
  { timestamps: true } 
);

const Chat = mongoose.model("Chat", chatSchema);
module.exports = Chat;
