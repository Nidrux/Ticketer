/* Import packages */
const express = require('express');
const { ChalkAdvanced } = require('chalk-advanced');

/* Import files */
const middleware = require('./functions/middleware');

/* Export */
module.exports = (client) => {
  /* Create express app */
  const app = express();

  /* Initialise middleware */
  middleware.initialize(app, client);

  /* Import api */
  middleware.api(app, client);

  /* Import web */
  middleware.web(app, client);

  /* Import cdn */
  middleware.cdn(app);

  console.log(`${ChalkAdvanced.white('Ticketer')} ${ChalkAdvanced.gray('>')} ${ChalkAdvanced.green('Website online')}`);
};
