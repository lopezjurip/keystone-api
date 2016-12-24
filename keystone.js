const keystone = require('keystone');
const express = require('express');
const mongoose = require('mongoose');
const Promise = require('bluebird');

const config = require('./config');
const routes = require('./routes');

const app = express();

// Setup MongoDB driver
mongoose.Promise = Promise;
keystone.set('mongoose', mongoose);

// Load settings
keystone.init(config.init);

// Load your project's Models
keystone.import('models');

// Setup Express.js routes
keystone.set('routes', routes);

// Configure the navigation bar in Keystone's Admin UI
keystone.set('nav', {
  users: ['Administrator', 'User'],
});

keystone.initExpressApp(app);
keystone.openDatabaseConnection(() => {
  console.log(`> Connected to ${keystone.get('mongo')}`); // eslint-disable-line
});

exports.app = app;
exports.keystone = keystone;
