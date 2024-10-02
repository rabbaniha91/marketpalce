const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../database/user");
const { googleClientId, googleClientSecret } = require("../../../configs/env_vars");

passport.use(
  "google-auth",
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, { email: profile.emails[0].value });
      } catch (err) {
        done(err, null);
      }
    }
  )
);

passport.use(
  "google-change",
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/api/v1/auth/change-email/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        done(null, { email: profile.emails[0].value });
      } catch (err) {
        done(err, null);
      }
    }
  )
);
module.exports = passport;
