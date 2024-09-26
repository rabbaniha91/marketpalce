const express = require("express");
require("dotenv").config({ path: "../../.env" });

const productRouter = require("./routes/products");
const storeRouter = require("./routes/store");

const app = express();
const PORT = process.env.STORE_SERVICE_PORT;

app.use("/api/v1/store", storeRouter);
app.use("/api/v1/product", productRouter);

app.listen(PORT, () => {
  console.log(`Store service run on port ${PORT}`);
});
