const express = require("express");
require("dotenv").config({ path: "../../.env" });

const { dBConnected } = require("../../database/congfig");

const authRouter = require("./routes/user");
const cartRouter = require("./routes/shopoingCart");

const app = express();
const PORT = process.env.USER_SERVICE_PORT;
const dbURL = process.env.MONGO_URL;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);

dBConnected(dbURL).then(() => {
  console.log(`User serivce successfuly connect to db ...`);
  app.listen(PORT, () => {
    console.log(`User service run on port ${PORT}...`);
  });
});
