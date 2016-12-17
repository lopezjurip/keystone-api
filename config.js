exports.init = {
  name: 'API',

  static: 'public',
  favicon: 'public/favicon.ico',

  // 'views': 'templates/views',
  // 'view engine': 'jade',

  'auto update': true,
  mongo: process.env.MONGO_URI || 'mongodb://localhost/my-project',

  session: true,
  auth: true,
  'user model': 'User',
  'cookie secret': process.env.COOKIE_SECRET || 'demo',
};
