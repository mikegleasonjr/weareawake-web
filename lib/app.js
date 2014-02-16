var express = require('express'),
  i18n = require('i18n-2'),
  passport = require('passport'),
  handlebars = require('./handlebars'),
  routes = require('./routes'),
  i18nHeader = require('./middleware/i18nHeader'),
  config = require('./config'),
  rollbar = require('rollbar'),
  RedisStore = require('connect-redis')(express);

module.exports = {
  bootstrap: function(port) {
    return configure(express(), port);
  }
};

function configure(app, port) {
  // options
  app.enable('trust proxy');
  app.enable('strict routing');

  // view engine
  handlebars.bind(app);   // TODO, test

  // locales
  i18n.expressBind(app, {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    subdomain: true,
    query: false
  });

  // passport strategies
  require('./authentication/passport');

  sessionOptions = { key: 'sessionId', cookie: { domain: config.get('COOKIE_DOMAIN'), path: '/', httpOnly: true, maxAge: config.get('SESSION_EXPIRATION_MS') }};
  if (app.get('env') === 'production') {
    sessionOptions.store = new RedisStore({ host: config.get('CACHE_HOST') });
  }

  // middlewares
  app.use(express.responseTime());
  app.use(express.cookieParser(config.get('COOKIE_SECRET')));
  app.use(express.session(sessionOptions)); // TODO, test session contains user: 123
  app.use(passport.initialize());
  app.use(passport.session()); // TODO, test... not calling deserialize / does not set req.user
  app.use(i18nHeader());
  if (app.get('env') === 'development') {
    app.use(express.logger('dev'));
    app.use('/static', express.static('static'));
    app.use(app.router);
    app.use(express.errorHandler());
  }
  else {
    app.use(app.router);
    app.use(rollbar.errorHandler(config.get('ROLLBAR_SERVER_TOKEN')));
  }

  // routes
  routes.bind(app);

  // listen!
  return app.listen(port);
}
