const AppError = require("./AppError");

const uncaughError = (service) => {
  process.on("uncaughtException", (err) => {
    console.log(`UNCAUGH EXCEPTION in ${service} services Shuting down ...`);
    console.log(err.name + " " + err.message);
    process.exit(1);
  });
};

const unhandledError = (server, service) => {
  process.on("unhandledRejection", (err) => {
    console.log(`Unhandled Rejection in ${service} services shuting down ...`);
    console.log(err.name + " " + err.message);
    server.close(() => {
      process.exit(1);
    });
  });
};

const handleEntityParseFailed = () => {
  let message = "رشته json ارسالی معتبر نیست";
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message + "❤️",
    stack: err.stack,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.log("Error 🤦‍♀️", err);
    res.status(500).json({
      status: "error",
      message: "خطایی در سرور رخ داد!",
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";
  if (process.env.NODE_ENV?.trim() === "development") {
    return sendErrorDev(err, res);
  } else if (process.env.NODE_ENV?.trim() === "production") {
    let error = { ...err, message: err.message };
    if (err.type === "entity.parse.failed") error = handleEntityParseFailed();
    return sendErrorProd(error, res);
  }
};

module.exports = { uncaughError, unhandledError, globalErrorHandler };
