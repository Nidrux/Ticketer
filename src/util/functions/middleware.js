/* Import packages */
const express = require('express');
const session = require('express-session');
const MoongoStore = require('connect-mongo');
const cors = require('cors');

/* Functions */
const initialize = (app) => {
  // Set port
  app.listen(process.env.PORT);

  // Set viewengine
  app.set('view engine', 'ejs');

  // Set trustproxy
  app.set('trust proxy', 1);

  // Setup session
  app.use(session({
    cookie: { secure: !!process.env.WEB.includes('https') },
    saveUninitialized: false,
    secret: 'This is a secret!',
    session: true,
    store: MoongoStore.create({
      mongoUrl: process.env.DATABASE_URI,
    }),
    resave: false,
    maxAge: 7884000000,
  }));

  // Use cors
  app.use(cors());

  // Setup json readout
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));

  return app;
};

const api = (app, client) => {
  // Import api
  require('../routes/api')(app, client);

  return app;
};

const web = (app, client) => {
  // Import web
  require('../routes/views')(app, client);

  return app;
};

const cdn = (app) => {
  // Import cdn
  require('../routes/cdn')(app);

  return app;
};

/* Export */
module.exports = {
  initialize,
  api,
  web,
  cdn,
};
