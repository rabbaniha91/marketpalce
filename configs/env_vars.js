module.exports = {
  userServicesPort: process.env.USER_SERVICE_PORT,
  storeServicesPort: process.env.STORE_SERVICE_PORT,
  paymentServicesPort: process.env.PAYMENT_SERVICE_PORT,
  mongoURL: process.env.MONGO_URL,
  secretRefreshToken: process.env.REFRESH_TOKEN_SECRET,
  secretAccessToken: process.env.ACCESS_TOKEN_SECRET,
  googleClientId: process.env.GOOGLE_CLIENT_ID,
  googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
};
