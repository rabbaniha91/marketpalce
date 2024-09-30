const bcrypt = require("bcrypt");
const { validationResult, cookie } = require("express-validator");
const JWT = require("jsonwebtoken");

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
      await setCookie(cookie, user, User, refreshToken, res);

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
        return next(new AppError("Email or Phone is required", 401));
      }

      if (!user) return next(new AppError("User not found", 404));

      if (!user.password) {
        return next(new AppError("User dont set password", 400));
      }

      const correctPass = await bcrypt.compare(password, user.password);

      if (!correctPass) return next(new AppError("Incorrect password", 401));

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

  // generate new refresh token and access token to keep the user logged in
  static generateRefreshToken = catchFunc(async (req, res, next) => {
    try {
      const cookies = req.cookies;
      if (!cookies?.jwt) return next(new AppError("access forbidden, No cookie has been set", 403));
      const refreshToken = cookies?.jwt;
      res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: true });

      const user = await User.getUserByToken(refreshToken);

      console.log(user);

      if (!user) {
        JWT.verify(refreshToken, secretRefreshToken, async (err, decoded) => {
          if (err) return;
          const hackedUser = await User.getUserById(decoded.id);
          if (hackedUser) {
            hackedUser.refreshTokens = [];
            await hackedUser.save();
          }
        });

        return next(new AppError("Access forbiden, user not found", 403));
      }

      const newRefreshTokenArray = user.refreshTokens.filter((rt) => {
        return rt !== refreshToken;
      });

      JWT.verify(refreshToken, secretRefreshToken, async (err, decoded) => {
        if (err) {
          user.refreshTokens = [...newRefreshTokenArray];
          await user.save();
        }

        if (err || user._id.toString() !== decoded.id) return next(new AppError("Access forbiden, incorrect token", 403));

        const accessToken = createToken(decoded.id, secretAccessToken, "2h");
        const newRefreshToken = createToken(decoded.id, secretRefreshToken, "15d");

        user.refreshTokens = [...newRefreshTokenArray, newRefreshToken];
        await user.save();

        res.cookie("jwt", {
          httpOnly: true,
          sameSite: "None",
          secure: true,
          maxAge: 1000 * 60 * 60 * 24 * 15,
        });

        res.status(200).json({
          message: "Success",
          user: {
            firstname: user.firstname,
            lastname: user.lastname,
            picture: user.profilePicture,
          },
          accessToken,
        });
      });
    } catch (error) {
      return next(new AppError(error.message, 500));
    }
  });
}

module.exports = userController;
