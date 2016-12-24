'use strict';

const app = require('./keystone').app;

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`> Started on http://localhost:${PORT}`);  // eslint-disable-line
});
