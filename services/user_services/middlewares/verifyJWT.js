const JWT = require("jsonwebtoken");
const AppError = require("../../../configs/AppError");
const { secretAccessToken } = require("../../../configs/env_vars");
const { User } = require("../database/user");

const authenticate = async (req, res, next) => {
  let accessToken = req.headers.authorization || req.headers.Authorization;

  if (!accessToken?.startsWith("Bearer ")) next(new AppError("Token has invalid format", 401));

  accessToken = accessToken.split(" ")[1];

  JWT.verify(accessToken, secretAccessToken, async (err, decoded) => {
    if (err) return next(new AppError("Forbiden", 403));

    const user = await User.getUserById(decoded.id);

    if (!user) return next(new AppError("User not found", 404));

    req.userId = decoded.id;
    
    next();
  });
};

module.exports = { authenticate };
