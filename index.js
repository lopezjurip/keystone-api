'use strict';

const app = require('./keystone').app;
const config = require('./config');

const PORT = config.init.port;

app.listen(PORT, () => {
  console.log(`> Started on http://localhost:${PORT}`);  // eslint-disable-line
});
