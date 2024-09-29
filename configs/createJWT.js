const jwt = require("jsonwebtoken");

const createToken = (id, secret, expire) => {
  return jwt.sign({ id }, secret, { expiresIn: expire });
};

module.exports = { createToken };
