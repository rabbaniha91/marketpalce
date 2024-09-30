const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const UserModel = require("../models/user");

const AppError = require("../../../configs/AppError");
const catchFunc = require("../../../configs/catchFunc");
const { User } = require("../database/user");
const { Notification } = require("../database/notification");
const { createToken } = require("../../../configs/createJWT");
const { secretAccessToken, secretRefreshToken } = require("../../../configs/env_vars");
const { setCookie } = require("../utils");

class userController {
  // register users with email and password
  static register = catchFunc(async (req, res, next) => {
    try {
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

  // auht with google oauth2 callback url
  static googleAuthCB = catchFunc(async (req, res, next) => {
    try {
      // get user from passport
      const user = req.user;
      // get cookies
      const cookies = req.cookies;

      //   create tokens
      const newRefreshToken = createToken(user._id, secretRefreshToken, "15d");
      const accessToken = createToken(user._id, secretAccessToken, "2h");

      //   set cookie
      await setCookie(cookies, user, User, newRefreshToken, res);

      res.status(200).json({
        message: "Authentication was successful",
        user,
        accessToken,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  });

  //   login
  static login = catchFunc(async (req, res, next) => {
    try {
      const { email, phone, password } = req.body;
      const cookies = req.cookies;
      //   validate user requests with express validator
      const validateResult = validationResult(req);

      if (!validateResult.isEmpty()) {
        return next(new AppError(validateResult.array()[0].msg, 400));
      }

      let user;
      if (email) {
        user = await User.getUserByEmail(email);
      } else if (phone) {
        user = await User.getUserByPhone(phone);
      } else {
        next(new AppError("Email or Phone is required", 401));
      }

      if (!user) next(new AppError("User not found", 404));

      const correctPass = await bcrypt.compare(password, user.password);

      if (!correctPass) next(new AppError("Incorrect password", 401));

      const newRefreshToken = createToken(user._id, secretRefreshToken, "15d");
      const accessToken = createToken(user._id, secretAccessToken, "2h");

      await setCookie(cookies, user, User, newRefreshToken, res);

      res.status(200).json({
        message: "User successfuly authenticated",
        user,
        accessToken,
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  });
}

module.exports = userController;
