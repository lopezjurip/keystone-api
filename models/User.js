const keystone = require('keystone');
const argon2 = require('argon2');

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
    initial: true,
    required: false,
  },
  email: {
    type: Types.Email,
    index: true,
    initial: true,
    required: false,
  },
  password: {
    type: Types.Password,
    initial: true,
    required: false,
  },
  facebook: {
    id: { type: String, index: true },
    profile: { type: Types.Code, height: 250, language: 'json' },
    accessToken: { type: String },
    refreshToken: { type: String },
  },
});

User.schema.pre('save', function save(next) {
  const user = this;

  // Skip if password has not changed
  if (!user.isModified('password')) {
    return next();
  }

  return argon2.generateSalt()
    .then(salt => argon2.hash(user.password, salt))
    .then(hash => (user.password = hash))
    .then(() => next())
    .catch(next);
});

User.schema.methods.verifyPassword = function verifyPassword(password) {
  const user = this;
  return argon2.verify(user.password, password);
};

User.schema.options.toJSON = {
  transform(doc, ret) {
    /* eslint-disable no-param-reassign */
    delete ret.password;
    delete ret.passwordResetToken;
    delete ret.passwordResetExpires;
    /* eslint-enable no-param-reassign */
  },
};

/**
 * Registration
 */
User.defaultSort = '-createdAt';
User.defaultColumns = 'name, email';
User.register();
