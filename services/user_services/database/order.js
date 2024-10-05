const OrderModel = require("../models/order");

class Order {
  static async getAllOrders(userId) {
    return await OrderModel.findMany({ user: userId })
      .populate({
        path: "user",
        select: "firstname lastname",
      })
      .populate({
        path: "products.product",
        select: "title",
      })
      .populate({
        path: "store",
        select: "title",
      })
      .populate({
        path: "transaction",
        select: "paymentMethod",
      });
  }
}

module.exports = Order;
