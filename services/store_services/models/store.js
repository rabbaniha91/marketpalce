const mongoose = require("mongoose");

const storeSchema = mongoose.Schema(
  {
    title: { type: String, required: true, text: true }, // عنوان فروشگاه
    description: { type: String }, // توضیحات فروشگاه
    logo: { type: String }, // لوگوی فروشگاه
    banner: { type: String }, // بنر فروشگاه
    createdBy: { type: mongoose.Types.ObjectId, ref: "User", required: true }, // صاحب فروشگاه
    videos: [{ type: String }], // ویدیوهای معرفی
    followers: [{ type: mongoose.Types.ObjectId, ref: "User" }], // دنبال‌کنندگان فروشگاه
    ratings: [
      {
        user: { type: mongoose.Types.ObjectId, ref: "User" }, // کاربری که امتیاز داده
        rate: { type: Number, default: 0, min: 1, max: 5 }, // امتیاز بین 1 تا 5
      },
    ],
    averageRating: { type: Number, default: 0 }, // میانگین امتیازات

    // فیلدهای آماری
    totalSales: { type: Number, default: 0 }, // تعداد کل فروش‌ها
    totalRevenue: { type: Number, default: 0 }, // مجموع درآمد
    totalViews: { type: Number, default: 0 }, // تعداد بازدیدهای فروشگاه
    totalCustomers: { type: Number, default: 0 }, // تعداد مشتریانی که خرید کرده‌اند
    topSellingProducts: [{ type: mongoose.Types.ObjectId, ref: "Product" }], // محصولات پرفروش
  },
  { timestamps: true } // فعال‌سازی زمان‌های ایجاد و به‌روزرسانی
);

const Store = mongoose.model("Store", storeSchema);
module.exports = Store;
