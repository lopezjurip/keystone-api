const express = require('express');
const keystone = require('keystone');
const auth = require('../../middleware/auth');

const router = new express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'on',
  });
});

router.post('/auth/local', auth.local, (req, res) => {
  res.json({ id: req.user.id, username: req.user.username });
});

router.get('/auth/facebook', auth.facebook);

router.get('/auth/facebook/callback', auth.facebook, (req, res) => {
  res.redirect(`${req.baseUrl}/profile?access_token=${req.user.facebook.accessToken}`);
});

router.post('/auth/facebook/token', auth.facebookToken, (req, res) => {
  res.json(req.user);
});

router.get('/profile', auth.facebookToken, (req, res) => {
  res.json(req.user);
});

router.get('/users', (req, res, next) => {
  keystone.list('User').model.find({}).lean()
    .then(users => res.json(users))
    .catch(next);
});

module.exports = router;
