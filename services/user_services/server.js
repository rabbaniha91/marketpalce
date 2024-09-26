const express = require("express");
const authRouter = require("./routes/user");
const cartRouter = require("./routes/shopoingCart");

const app = express();

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/cart", cartRouter);

app.listen(3002, () => {
  console.log(`server run on port 3002`);
});
