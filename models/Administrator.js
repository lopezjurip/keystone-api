const keystone = require('keystone');

const Types = keystone.Field.Types;

/**
 * Administrator Model
 * ==========
 */
const Administrator = new keystone.List('Administrator', {
  track: true,
  icon: 'user',
});

Administrator.add({
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
}, {
  heading: 'Permissions',
}, {
  admin: {
    label: 'Can access Admin interface',
    type: Boolean,
    initial: true,
    default: true,
    index: true,
  },
});

// Provide access to Keystone
Administrator.schema.virtual('canAccessKeystone').get(function canAccessKeystone() {
  return this.admin;
});

/**
 * Registration
 */
Administrator.defaultSort = '-createdAt';
Administrator.defaultColumns = 'name, email, admin';
Administrator.register();
