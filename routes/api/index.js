const express = require('express');
const keystone = require('keystone');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const FacebookTokenStrategy = require('passport-facebook-token');
const config = require('../../config').auth;


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


const router = new express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'on',
  });
});

router.post('/auth/local', passport.authenticate('basic', {
  session: false,
}), (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

router.get('/auth/facebook', passport.authenticate('facebook', {
  session: false,
  // scope: [],
}));

router.get('/auth/facebook/callback', passport.authenticate('facebook', {
  session: false,
  failureRedirect: '/',
}), (req, res) => {
  res.redirect(`/api/profile?access_token=${req.user.facebook.accessToken}`); // ?accessToken=''
});

router.post('/auth/facebook/token', passport.authenticate('facebook-token', {
  session: false,
}), (req, res) => {
  res.json(req.user);
});

router.get('/profile', passport.authenticate('facebook-token', {
  session: false,
}), (req, res) => {
  res.json(req.user);
});

router.get('/users', (req, res, next) => {
  keystone.list('User').model.find({}).lean()
    .then(users => res.json(users))
    .catch(next);
});

module.exports = router;
