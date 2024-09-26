const express = require("express");
require("dotenv").config({ path: "../../.env" });

const authRouter = require("./routes/user");
const cartRouter = require("./routes/shopoingCart");

const app = express();
const PORT = process.env.USER_SERVICE_PORT;

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);

app.listen(PORT, () => {
  console.log(`User service run on port ${PORT}`);
});
