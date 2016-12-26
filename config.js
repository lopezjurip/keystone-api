const Promise = require('bluebird');

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost/my-project';
const COOKIE_SECRET = process.env.COOKIE_SECRET || 'demo';

exports.init = {
  name: 'API',
  port: PORT,

  static: 'public',
  favicon: 'public/favicon.ico',

  // 'views': 'templates/views',
  // 'view engine': 'jade',

  'auto update': true,
  mongo: MONGO_URI,
  'mongo options': {
    promiseLibrary: Promise,
  },

  session: true,
  auth: true,
  'user model': 'Administrator',
  'cookie secret': COOKIE_SECRET,
};

exports.auth = {
  facebook: {
    clientID: process.env.FACEBOOK_AUTH_ID,
    clientSecret: process.env.FACEBOOK_AUTH_SECRET,
    callbackURL: process.env.FACEBOOK_AUTH_CALLBACK || `http://localhost:${PORT}/api/auth/facebook/callback`,
  },
};
