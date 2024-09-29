const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const UserModel = require("../models/user");

const AppError = require("../../../configs/AppError");
const catchFunc = require("../../../configs/catchFunc");
const { User } = require("../database/user");
const { createToken } = require("../../../configs/createJWT");
const { secretAccessToken, secretRefreshToken } = require("../../../configs/env_vars");

class userController {
  static register = catchFunc(async (req, res, next) => {
    try {
      await UserModel.deleteMany({});
      const { email, password } = req.body;

      const validateResult = validationResult(req);

      if (!validateResult.isEmpty()) {
        return next(new AppError(validateResult.array()[0].msg, 400));
      }

      let user = await User.getUserByEmail(email);

      if (user) {
        return next(new AppError("The user with email address already exists", 400));
      }

      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      user = await User.createUser({ email, password: hashPass });
      const refreshToken = createToken(user._id, secretRefreshToken, "15d");
      const accessToken = createToken(user._id, secretAccessToken, "2h");
      user.refreshTokens.push(refreshToken);
      await user.save();
      res.status(201).json({
        message: "User successfuly created",
        user,
        accessToken,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  });
}

module.exports = userController;
