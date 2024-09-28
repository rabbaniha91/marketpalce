const mongoose = require("mongoose");

const orderSchema = mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // کاربر که سفارش را ثبت کرده
    products: [
      {
        product: { type: mongoose.Types.ObjectId, ref: "Product" }, // ارجاع به محصولات
        quantity: { type: Number, required: true }, // تعداد هر محصول
        price: { type: Number, required: true }, // قیمت هر محصول در زمان سفارش
      },
    ],
    store: { type: mongoose.Types.ObjectId, ref: "Store" }, // فروشگاه مربوطه
    state: {
      type: String,
      enum: ["pending", "completed", "failed", "shipped", "canceled"], // اضافه کردن وضعیت‌های بیشتر
      default: "pending",
    },
    transaction: { type: mongoose.Types.ObjectId, ref: "Transaction" }, // تراکنش مربوط به سفارش
    totalPrice: { type: Number, required: true }, // قیمت کل سفارش
    shippingAddress: { type: mongoose.Types.ObjectId, ref: "Address" }, // آدرس ارسال
  },
  { timestamps: true }
); // اضافه کردن timestamps برای زمان ایجاد و به‌روزرسانی

const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
