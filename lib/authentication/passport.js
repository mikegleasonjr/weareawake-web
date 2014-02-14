var passport = require('passport'),
  FacebookStrategy = require('passport-facebook').Strategy,
  GoogleStrategy = require('passport-google').Strategy,
  TwitterStrategy = require('passport-twitter').Strategy,
  config = require('./../config'),
  bindings = require('./bindings');

passport.serializeUser(bindings.onSerializeUser);

passport.deserializeUser(bindings.onDeserializeUser);

passport.use(new FacebookStrategy({
    clientID: config.get('FACEBOOK_APP_ID'),
    clientSecret: config.get('FACEBOOK_APP_SECRET'),
    callbackURL: '/auth/facebook/callback'
  }, bindings.onFacebookLogin
));

passport.use(new TwitterStrategy({
    consumerKey: config.get('TWITTER_API_KEY'),
    consumerSecret: config.get('TWITTER_API_SECRET'),
    callbackURL: '/auth/twitter/callback'
  }, bindings.onTwitterLogin
));

passport.use(new GoogleStrategy({
    returnURL: config.get('GOOGLE_RETURN_URL'),
    realm: config.get('GOOGLE_REALM')
  }, bindings.onGoogleLogin
));
