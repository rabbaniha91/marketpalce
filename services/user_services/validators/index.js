const { body } = require("express-validator");

const registerValidator = () => {
  return [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required").isStrongPassword().withMessage("Weak passwprd"),
  ];
};

const loginValidator = () => {
  return [
    body("email").isEmail().withMessage("Invalid email address"),
    body("phone").isMobilePhone("ir-IR").withMessage("Invalid phone number"),
    body("password").notEmpty().withMessage("Password is required").isStrongPassword().withMessage("Weak passwprd"),
  ];
};

module.exports = { registerValidator, loginValidator };
