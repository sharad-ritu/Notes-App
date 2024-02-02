const express = require('express');
const router = express.Router();
const passport = require('passport');
const User = require('../models/user');

const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async function (accessToken, refreshToken, profile, done) {
      const newUser = {
        googleId: profile.id,
        displayName: profile.displayName,
        firstName: profile.name.givenName,
        lastName: profile.name.familyName,
        profileImage: profile.photos[0].value,
      };

      try {
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          done(null, user);
        } else {
          user = await User.create(newUser);
          done(null, user);
        }
      } catch (err) {
        console.log(err);
      }
    }
  )
);

//google login route
router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['email', 'profile'] })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: '/login-failure',
    successRedirect: '/dashboard',
  })
);

//router if failure
router.get('/login-failure', (req, res) => {
  res.send('something went wrong');
});

//destroy user session
router.get('/logout', (req, res) => {
  req.session.destroy((error) => {
    if (error) {
      console.log(error);
      res.send('Error Signing Out');
    } else {
      res.redirect('/');
    }
  });
});

//persist user data after successful login
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

//get user data from session
// passport.deserializeUser(function (id, done) {
//   User.findById(id, function (err, user) {
//     done(err, user);
//   });
// });
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

module.exports = router;
