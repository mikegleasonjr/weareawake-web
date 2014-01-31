var heartbeat = require('./heartbeat/views'),
  main = require('./main/views');

module.exports = {
  'bind': function(app) {
    app.get('/heartbeat', heartbeat.index);

    app.get('/', main.index);
  }
};
