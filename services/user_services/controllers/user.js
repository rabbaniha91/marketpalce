const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const UserModel = require("../models/user");

const AppError = require("../../../configs/AppError");
const catchFunc = require("../../../configs/catchFunc");
const { User } = require("../database/user");
const { Notification } = require("../database/notification");
const { createToken } = require("../../../configs/createJWT");
const { secretAccessToken, secretRefreshToken } = require("../../../configs/env_vars");

class userController {
  // register users with email and password
  static register = catchFunc(async (req, res, next) => {
    try {
      await UserModel.deleteMany();
      const { email, password } = req.body;

      //   validate user requests with express validator
      const validateResult = validationResult(req);

      if (!validateResult.isEmpty()) {
        return next(new AppError(validateResult.array()[0].msg, 400));
      }

      //   check repeat email
      let user = await User.getUserByEmail(email);

      if (user) {
        return next(new AppError("The user with email address already exists", 400));
      }

      //   hashed password
      const salt = await bcrypt.genSalt(10);
      const hashPass = await bcrypt.hash(password, salt);

      //   create user
      user = await User.createUser({ email, password: hashPass });

      //   crate necessary tokens
      const refreshToken = createToken(user._id, secretRefreshToken, "15d");
      const accessToken = createToken(user._id, secretAccessToken, "2h");
      user.refreshTokens.push(refreshToken);
      await user.save();

      //   create email verify notification
      const notif = await Notification.send("لطفا آدرس ایمیل خود را تائید نمائید.", user._id);

      //   send response
      res.status(201).json({
        message: "User successfuly created",
        user,
        accessToken,
        notif,
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  });

  static async googleAuthCB(req, res, next) {
    try {
      const user = req.user;
      const cookies = req.cookies;
      const newRefreshToken = createToken(user._id, secretRefreshToken, "15d");
      const accessToken = createToken(user._id, secretAccessToken, "2h");

      let newRefreshTokenArray = !cookies?.jwt
        ? user?.refreshTokens
        : user?.refreshTokens.filter((token) => {
            return token !== cookies?.jwt;
          });

      if (cookies?.jwt) {
        const foundUserWithToken = await User.getUserByToken(cookies?.jwt);
        if (!foundUserWithToken) newRefreshTokenArray = [];
        res.clearCookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
        });
      }

      user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
      res.cookie("jwt", newRefreshToken, {
        httpOnly: true,
        sameSite: "None",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 15,
      });
      await user.save();
      res.status(200).json({
        message: "Authentication was successful",
        user,
        accessToken,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  }
}

module.exports = userController;
