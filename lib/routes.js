var passport = require('passport'),
  heartbeat = require('./heartbeat/views'),
  main = require('./main/views');

module.exports = {
  bind: function(app) {
    app.get('/', main.index);

    app.get('/heartbeat', heartbeat.index);

    app.get('/auth/facebook', passport.authenticate('facebook'));
    app.get('/auth/facebook/callback', passport.authenticate('facebook', { successRedirect: '/login?fbsuccess=1', failureRedirect: '/login?fbsuccess=0' }));

    app.get('/auth/twitter', passport.authenticate('twitter'));
    app.get('/auth/twitter/callback', passport.authenticate('twitter', { successRedirect: '/login?twsuccess=1', failureRedirect: '/login?twsuccess=0' }));

    app.get('/auth/google', passport.authenticate('google'));
    app.get('/auth/google/callback', passport.authenticate('google', { successRedirect: '/login?googsuccess=1', failureRedirect: '/login?googsuccess=0' }));
  }
};
