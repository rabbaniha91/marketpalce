const express = require("express");
require("dotenv").config({ path: "../../.env" });

const { dBConnected } = require("../../configs/dbConnect.js");

const productRouter = require("./routes/products");
const storeRouter = require("./routes/store");

const app = express();
const PORT = process.env.STORE_SERVICE_PORT;
const dbURL = process.env.MONGO_URL;

app.use("/api/v1/store", storeRouter);
app.use("/api/v1/product", productRouter);

dBConnected(dbURL).then(() => {
  console.log(`Store serivce successfuly connect to db ...`);
  app.listen(PORT, () => {
    console.log(`Store service run on port ${PORT}...`);
  });
});
