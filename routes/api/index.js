const express = require('express');
const keystone = require('keystone');

const router = new express.Router();

router.get('/', (req, res, next) => {
  keystone.list('User').model.find({}).lean()
    .then(users => res.json(users))
    .catch(next);
});

module.exports = router;
