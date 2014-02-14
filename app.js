var app = require('./lib/app'),
  config = require('./lib/config');

// TODO: test port 8000
module.exports = app.bootstrap(config.get('PORT'));
