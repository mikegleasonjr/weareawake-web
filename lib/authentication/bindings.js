function serializeUser(user, done) {
  //console.log('serializeUser', user);
  done(null, user.id);
}

function deserializeUser(id, done) {
  //console.log('deserializeUser', id);
  var err = null;
  var user = { id: 123, name: 'Mike' };
  //User.findById(id, function(err, user) {
    done(err, user);
  //});
}

function facebookLogin(accessToken, refreshToken, profile, done) {
  //console.log('facebookLogin', arguments);
  var err = null;
  var user = { id: 123, name: 'Mike' };
  //User.findOrCreate(profile, function(err, user) {
    done(err, user);
  //});
}

function twitterLogin(token, tokenSecret, profile, done) {
  //console.log('twitterLogin', arguments);
  var err = null;
  var user = { id: 123, name: 'Mike' };
  //User.findOrCreate(profile, function(err, user) {
    done(err, user);
  //});
}

function googleLogin(identifier, profile, done) {
  //console.log('googleLogin', arguments);
  var err = null;
  var user = { id: 123, name: 'Mike' };
  //User.findOrCreate({ openId: identifier }, function(err, user) {
    done(err, user);
  //});
}

module.exports = {
  onSerializeUser: serializeUser,
  onDeserializeUser: deserializeUser,
  onFacebookLogin: facebookLogin,
  onTwitterLogin: twitterLogin,
  onGoogleLogin: googleLogin
};
