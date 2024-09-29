const UserModel = require("../models/user");
class User {
  static async createUser(user) {
    const newUser = await new UserModel({
      ...user,
    }).save();

    return newUser;
  }
  static async getUserByEmail(email) {
    return await UserModel.findOne({ email });
  }
  static async getUserByPhone(phone) {
    return await UserModel.findOne({ phone });
  }
  static async getUserByUsername(username) {
    return await UserModel.findOne({ username });
  }
}

module.exports = { User };
