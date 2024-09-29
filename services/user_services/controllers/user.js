const bcrypt = require("bcrypt");
const { validationResult } = require("express-validator");

const AppError = require("../../../configs/AppError");
const catchFunc = require("../../../configs/catchFunc");
const { User } = require("../database/user");

class userController {
  static register = catchFunc(async (req, res, next) => {
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
    res.status(201).json({
      message: "User successfuly created",
      user,
    });
  });
}

module.exports = userController;
