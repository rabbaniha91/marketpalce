const NotificationModel = require("../models/notification.js");

class Notification {
  static async send(title, userId) {
    return await new NotificationModel({ title, user: userId }).save();
  }
}

module.exports = { Notification };
