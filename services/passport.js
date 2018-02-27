const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const mongoose = require('mongoose');
const keys = require('../config/keys');

const User = mongoose.model('users');

// takes the retrieved user and returns the id
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// takes id and returns a user
passport.deserializeUser((id, done) => {
  User.findById(id).then(user => {
    done(null, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID: keys.googleClientID,
      clientSecret: keys.googleClientSecret,
      callbackURL: '/auth/google/callback',
      proxy: true
    },
    async (accessToken, refreshToken, profile, done) => {
      // check if user exists in DB
      const existingUser = await User.findOne({ googleId: profile.id });

      if (existingUser) {
        // already have record with given profile ID
        done(null, existingUser); // error object, user
      } else {
        // make new record
        const user = await new User({ googleId: profile.id }).save();
        done(null, user);
      }
    }
  )
);
