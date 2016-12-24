const Promise = require('bluebird');

exports.init = {
  name: 'API',

  static: 'public',
  favicon: 'public/favicon.ico',

  // 'views': 'templates/views',
  // 'view engine': 'jade',

  'auto update': true,
  mongo: process.env.MONGO_URI || 'mongodb://localhost/my-project',
  'mongo options': {
    promiseLibrary: Promise,
  },

  session: true,
  auth: true,
  'user model': 'Administrator',
  'cookie secret': process.env.COOKIE_SECRET || 'demo',
};
