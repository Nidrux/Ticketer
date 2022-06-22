/* Import modules */
const { join } = require('path');
const express = require('express');

/* Export */
module.exports = (app) => {
  app.use('/assets', express.static(join(__dirname, '../cdn/assets')));

  return app;
};
