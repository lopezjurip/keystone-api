const express = require('express');
const keystone = require('keystone');

const router = new express.Router();

router.get('/', (req, res) => {
  res.json({
    status: 'on',
  });
});

router.get('/users', (req, res, next) => {
  keystone.list('User').model.find({}).lean()
    .then(users => res.json(users))
    .catch(next);
});

module.exports = router;
