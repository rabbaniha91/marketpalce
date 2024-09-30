const JWT = require("jsonwebtoken");
const AppError = require("../../../configs/AppError");
const { secretAccessToken } = require("../../../configs/env_vars");

const authenticate = async (req, res, next) => {
 
  let accessToken = req.headers.authorization || req.headers.Authorization;

  if (!accessToken?.startsWith("Bearer ")) next(new AppError("Token has invalid format", 401));

  accessToken = accessToken.split(" ")[1];

  JWT.verify(accessToken, secretAccessToken, (err, decoded) => {
    if (err) new AppError("Forbiden", 403);

    req.userId = decoded.id;
    next();
  });
};

module.exports = { authenticate };
