const keystone = require('keystone');

const Types = keystone.Field.Types;

/**
 * User Model
 * ==========
 */
const User = new keystone.List('User', {
  track: true,
});

User.add({
  name: {
    type: Types.Name,
    required: true,
  },
  email: {
    type: Types.Email,
    initial: true,
    required: true,
    index: true,
  },
  password: {
    type: Types.Password,
    initial: true,
    required: true,
  },
});

/**
 * Registration
 */
User.defaultSort = '-createdAt';
User.defaultColumns = 'name, email';
User.register();
