const express = require("express");
require("dotenv").config({path: '../../.env'});

const { dBConnected } = require("../../configs/dbConnect.js");


const app = express();
const PORT = process.env.PAYMENT_SERVICE_PORT;
const dbURL = process.env.MONGO_URL;


// app.use(authenticate);


dBConnected(dbURL).then(() => {
  console.log(`Payment serivce successfuly connect to db ...`);
  app.listen(PORT, () => {
    console.log(`Payment service run on port ${PORT}...`);
  });
});
