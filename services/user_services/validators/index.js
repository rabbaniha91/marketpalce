const { body } = require("express-validator");

const registerValidator = () => {
  return [
    body("email").notEmpty().withMessage("Email is required").isEmail().withMessage("Invalid email address"),
    body("password").notEmpty().withMessage("Password is required").isStrongPassword().withMessage("Weak passwprd"),
  ];
};

const loginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Invalid email address"),
    body("phone").optional().isMobilePhone("ir-IR").withMessage("Invalid phone number"),
    body("password").notEmpty().withMessage("Password is required").isStrongPassword().withMessage("Weak passwprd"),
  ];
};

const updateValidator = () => {
  return [
    body("firstname").optional().isLength({ min: 3 }).withMessage("First name must be at 3 characters"),
    body("lastname").optional().isLength({ min: 3 }).withMessage("Last name must be at 3 characters"),
    body("birthDate").optional().isDate({ format: "YYYY-MM-DD" }).withMessage('Date not valid'),
  ];
};

module.exports = { registerValidator, loginValidator, updateValidator };
