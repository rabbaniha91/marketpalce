const express = require("express");
require("dotenv").config({ path: "../../.env" });

const { dBConnected } = require("../../configs/dbConnect.js");

const authRouter = require("./routes/user");
const cartRouter = require("./routes/shopoingCart");
const { uncaughError, unhandledError, globalErrorHandler } = require("../../configs/errorController.js");
const { userServicesPort, mongoURL } = require("../../configs/env_vars.js");
const service = "user";
uncaughError(service);

const app = express();
const PORT = userServicesPort;
const dbURL = mongoURL;

app.use(express.json());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);

app.use(globalErrorHandler);

dBConnected(dbURL).then(() => {
  console.log(`User serivce successfuly connect to db ...`);
  const server = app.listen(PORT, () => {
    console.log(`User service run on port ${PORT}...`);
  });

  unhandledError(server, service);
});
