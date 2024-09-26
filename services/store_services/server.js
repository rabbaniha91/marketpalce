const express = require("express");
const productRouter = require("./routes/products");
const storeRouter = require("./routes/store");

const app = express();

app.use('/api/v1/store', storeRouter)
app.use('/api/v1/product', productRouter)
