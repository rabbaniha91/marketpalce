const bcrypt = require("bcrypt");
const { validationResult, cookie } = require("express-validator");
const JWT = require("jsonwebtoken");

const AppError = require("../../../configs/AppError");
const catchFunc = require("../../../configs/catchFunc");
const { User } = require("../database/user");
const { createToken } = require("../../../configs/createJWT");
const { secretAccessToken, secretRefreshToken, emailVerify } = require("../../../configs/env_vars");
const { setCookie } = require("../utils");

class userController {
  // auht with google oauth20 callback url
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

  static update = catchFunc(async (req, res, next) => {
    try {
      const { firstname, lastname, birthDate } = req.body;
      const { userId } = req;

      const validateResult = validationResult(req);

      if (!validateResult.isEmpty()) {
        return next(new AppError(validateResult.array()[0].msg, 400));
      }

      let user = await User.getUserById(userId);
      if (!user) {
        return next(new AppError("Invalid information", 400));
      }

      user = await User.upddateUser(userId, { firstname, lastname, birthDate });

      res.status(200).json({
        message: "Success",
        user: {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          phone: user.phone,
          birthDate: user.birthDate,
          picture: user.profilePicture,
        },
      });
    } catch (error) {
      next(new AppError(error.message, 500));
    }
  });
}

module.exports = userController;
