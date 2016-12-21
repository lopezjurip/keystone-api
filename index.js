'use strict';

// const keystone = require('./keystone').keystone;
const app = require('./keystone').app;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log('Started'); // eslint-disable-line
});

// Start app
// keystone.start();
