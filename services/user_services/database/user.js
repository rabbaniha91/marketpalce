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
    return await UserModel.findByIdAndUpdate(id, { password }, { new: true });
  }

  static async changeEmail(id, email) {
    return await UserModel.findByIdAndUpdate(id, { email }, { new: true });
  }

  static async updateProfilePicture(id, profilePicture) {
    return await UserModel.findByIdAndUpdate(id, { profilePicture }, { new: true });
  }

  static async getUserFavorites(id) {
    return await UserModel.findById(id).select("favorites").populdate({
      path: "favorites",
      select: "title price",
    });
  }

  static async addStore(userId, storeId) {
    return await UserModel.findOneAndUpdate(
      { _id: userId },
      {
        hasStore: true,
        $push: {
          stores: storeId,
        },
      },
      { new: true }
    );
  }

  static async getStores(userId) {
    return await UserModel.findById({ _id: userId }).select("stores").populate({
      path: "stores",
      select: "title logo createdAt",
    });
  }
}

module.exports = { User };
