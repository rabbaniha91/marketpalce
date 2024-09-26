const mongoose = require("mongoose");

const dBConnected = async (uri) => {
  await mongoose.connect(uri);
};

module.exports = { dBConnected };
