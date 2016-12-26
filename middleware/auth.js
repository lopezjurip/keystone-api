const keystone = require('keystone');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('../config').auth;

const facebookVerify = (accessToken, refreshToken, profile, done) => {
  const User = keystone.list('User').model;

  User.findOne({ 'facebook.id': profile.id })
    // Update or create
    .then(result => result || new User())
    .then(user => Object.assign(user, {
      facebook: {
        id: profile.id,
        profile: JSON.stringify(profile, null, 4),
        accessToken,
        refreshToken,
      },
    }))
    .then(user => user.save())
    .then(user => done(null, user))
    .catch(done);
};

passport.use(new FacebookTokenStrategy(config.facebook, facebookVerify));
passport.use(new FacebookStrategy(config.facebook, facebookVerify));
passport.use(new LocalStrategy((email, password, done) => {
  const User = keystone.list('User').model;

  User.findOne({ email }).then(user => {
    if (!user) {
      return done(null, false, { message: 'Email not found.' });
    }
    return user.verifyPassword(password).then(valid => {
      if (!valid) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }).catch(done);
}));

/* Exports middlewares */

exports.local = passport.authenticate('basic', {
  session: false,
});

exports.facebook = passport.authenticate('facebook', {
  session: false,
  failureRedirect: '/',
  // scope: [],
});

exports.facebookToken = passport.authenticate('facebook-token', {
  session: false,
});

exports.authenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    res.status(401).send({ message: 'Unauthorized' });
  }
};
