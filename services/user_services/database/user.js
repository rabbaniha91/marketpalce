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

  static async getUserById(id) {
    return await UserModel.findById(id);
  }
  static async getUserByPhone(phone) {
    return await UserModel.findOne({ phone });
  }
  static async getUserByUsername(username) {
    return await UserModel.findOne({ username });
  }
  static async getUserByToken(token) {
    return await UserModel.findOne({ refreshTokens: token });
  }
  static async upddateUser(id, userInfo) {
    return await UserModel.findByIdAndUpdate(id, { ...userInfo }, { new: true });
  }
}

module.exports = { User };
