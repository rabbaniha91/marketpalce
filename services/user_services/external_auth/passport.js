const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { User } = require("../database/user");
const { googleClientId, googleClientSecret } = require("../../../configs/env_vars");

passport.use(
  new GoogleStrategy(
    {
      clientID: googleClientId,
      clientSecret: googleClientSecret,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.getUserByEmail(profile.emails[0].value);
        if (!user) {
          user = await User.createUser({
            email: profile.emails[0].value,
            firstname: profile.name.givenName,
            lastname: profile.name.familyName,
            profilePicture: profile.photos[0].value,
            verfiedEmail: profile.emails[0].verified,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

module.exports = passport;
