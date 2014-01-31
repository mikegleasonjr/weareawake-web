var express = require('express'),
  i18n = require('i18n-2'),
  handlebars = require('./handlebars'),
  routes = require('./routes'),
  i18nHeader = require('./middleware/i18nHeader');

module.exports = {
  'bootstrap': function(port) {
    return configure(express(), port);
  }
};

function configure(app, port) {
  // options
  app.enable('trust proxy');
  app.enable('strict routing');

  // view engine
  handlebars.bind(app);

  // locales
  i18n.expressBind(app, {
    locales: ['en', 'fr'],
    defaultLocale: 'en',
    subdomain: true,
    query: false
  });

  // middlewares
  app.use(i18nHeader());
  app.use(express.responseTime());
  app.use(app.router);
  if (app.get('env') === 'development') {
    app.use('/static', express.static('static'));
    app.use(express.logger('dev'));
    app.use(express.errorHandler());
  }

  // routes
  routes.bind(app);

  // listen!
  return app.listen(port);
}
