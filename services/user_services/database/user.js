const AppError = require("../../../configs/AppError");
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

  static async createPassword(id, password) {
    try {
      await UserModel.findByIdAndUpdate(id, { password });
      return true;
    } catch (error) {
      new AppError(error.message, 500);
    }
  }
  static async changeEmail(id, email) {
    try {
      await UserModel.findByIdAndUpdate(id, { email });
      return true;
    } catch (error) {
      new AppError(error.message, 500);
    }
  }
}

module.exports = { User };
