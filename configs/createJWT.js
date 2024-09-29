const jwt = require("jsonwebtoken");

const createToken = (id, secret, expire) => {
  jwt.sign({ id }, secret, { expiresIn: expire });
};

module.exports = { createToken };
