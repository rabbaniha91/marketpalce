const express = require("express");
require("dotenv").config({path: '../../.env'});

const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT;

// app.use(authenticate);

app.listen(PORT, () => {
  console.log(`Payment service run on port ${PORT}`);
});
