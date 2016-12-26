const express = require('express');
const keystone = require('keystone');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const BearerStrategy = require('passport-http-bearer').Strategy;

const config = require('../../config');

const facebook = Object.assign({}, config.auth.facebook, {
  profileFields: ['id', 'email', 'first_name', 'last_name'],
});

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

passport.use(new FacebookStrategy(facebook, (accessToken, refreshToken, profile, done) => {
  const User = keystone.list('User').model;

  User.findOne({ 'facebook.id': profile.id }).then(result => {
    // Already logged user
    const user = result || new User();
    // if (user) {
    //   return done(null, user);
    // }

    user.facebook = {
      id: profile.id,
      profile: JSON.stringify(profile, null, 4),
      accessToken,
      refreshToken,
    };
    return user.save();

    // Create user
    // return keystone.list('User').model.create({
    //   facebook: {
    //     id: profile.id,
    //     profile: JSON.stringify(profile, null, 4),
    //     accessToken,
    //     refreshToken,
    //   },
    // });
  })
  .then(user => done(null, user))
  .catch(done);
}));

passport.use(new BearerStrategy((accessToken, done) => {
  const User = keystone.list('User').model;

  User.findOne({ 'facebook.accessToken': accessToken }).then(user => {
    // User not found
    if (!user) {
      return done(null, false);
    }
    // Continue
    return done(null, user, { scope: 'all' });
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

router.get('/profile', passport.authenticate('bearer', {
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
