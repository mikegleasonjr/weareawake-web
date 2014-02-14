var request = require('supertest'),
  should = require('should'),
  sinon = require('sinon'),
  passeport = require('passport'),
  app = require('../../app');


describe('authentication', function() {
  describe('facebook', function() {
    describe('when requesting resource /auth/facebook', function() {
      it('should respond 302', function(done) {
        request(app)
          .get('/auth/facebook')
          .expect('Location', /^https:\/\/www\.facebook\.com\/dialog\/oauth/)
          .expect('Location', new RegExp('redirect_uri=.*' + encodeURIComponent('/auth/facebook/callback')))
          .expect(302, done);
      });
    });

    describe('when Facebook calls /auth/facebook/callback when authentication fails', function() {
      it('should redirect to the authentication failure page', function(done) {
        request(app)
          .get('/auth/facebook/callback?error=access_denied&error_code=200&error_description=Permissions+error&error_reason=user_denied')
          .expect('Location', /\/login\?fbsuccess=0/)
          .expect(302, done);
      });
    });

    describe('when Facebook calls /auth/facebook/callback when authentication succeeds', function() {
      it('should redirect to the authentication succeeded page', function(done) {
        var getAccessTokenStub = sinon.stub(passeport._strategies.facebook._oauth2, 'getOAuthAccessToken', function(code, options, callback) {
          var paramsFromFacebook = {};
          var err = null;
          callback(err, 'accessToken', 'refreshToken', paramsFromFacebook);
        });

        var loadFacebookProfileStub = sinon.stub(passeport._strategies.facebook, '_loadUserProfile', function(accessToken, callback) {
          var err = null;
          var profile = { id: '123', displayName: 'Mocked User' };
          callback(err, profile);
        });

        request(app)
          .get('/auth/facebook/callback?code=AQCPxK0FjCQu...')
          .expect('Location', /\/login\?fbsuccess=1/)
          .expect(302, function(err) {
            getAccessTokenStub.restore();
            loadFacebookProfileStub.restore();
            done(err);
          });
      });
    });
  });

  describe('twitter', function() {
    describe('when requesting resource /auth/twitter', function() {
      it('should respond 302', function(done) {
        request(app)
          .get('/auth/twitter')
          .expect('Location', /^https:\/\/api.twitter.com\/oauth\/authenticate\?oauth_token=/)
          .expect(302, done);
      });
    });

    describe('when Twitter calls /auth/twitter/callback when authentication fails', function() {
      var getRequestTokenStub = sinon.stub(passeport._strategies.twitter._oauth, 'getOAuthRequestToken', function(params, callback) {
        var paramsFromTwitter = {};
        var err = null;
        callback(err, 'token', 'tokenSecret', paramsFromTwitter);
      });

      it('should redirect to the authentication failure page', function(done) {
        request(app)
          .get('/auth/twitter/callback?denied=AH9NoALPlHaMqq34oLDvzxApktSYHsj4h6KcOeevI')
          .expect('Location', /\/login\?twsuccess=0/)
          .expect(302, function(err) {
            getRequestTokenStub.restore();
            done(err);
          });
      });
    });

    describe('when Twitter calls /auth/twitter/callback when authentication succeeds', function() {
      it('should redirect to the authentication succeeded page', function(done) {
        var authenticateStub = sinon.stub(passeport._strategies.twitter, 'authenticate', function() {
          var self = this,
            profile = { id: '123', displayName: 'Mocked User' };
          this._verify('token', 'tokenSecret', profile, function(err, user, info) {
            if (err) {
              return self.error(err);
            }
            if (!user) {
              return self.fail(info);
            }
            self.success(user, info);
          });
        });

        request(app)
          .get('/auth/twitter/callback?oauth_token=abv&oauth_verifier=xyz')
          .expect('Location', /\/login\?twsuccess=1/)
          .expect(302, function(err) {
            authenticateStub.restore();
            done(err);
          });
      });
    });
  });

  describe('google', function() {
    describe('when requesting resource /auth/google', function() {
      it('should respond 302', function(done) {
        request(app)
          .get('/auth/google')
          .expect('Location', /^https:\/\/www\.google\.com\/accounts\/o8\/ud/)
          .expect(302, done);
      });
    });

    describe('when Google calls /auth/google/callback when authentication fails', function() {
      it('should redirect to the authentication failure page', function(done) {
        request(app)
          .get('/auth/google/callback?openid.mode=cancel&openid.ns=http%3A%2F%2Fspecs.openid.net%2Fauth%2F2.0')
          .expect('Location', /\/login\?googsuccess=0/)
          .expect(302, done);
      });
    });

    describe('when Google calls /auth/google/callback when authentication succeeds', function() {
      it('should redirect to the authentication succeeded page', function(done) {
        var authenticateStub = sinon.stub(passeport._strategies.google, 'authenticate', function() {
          var self = this,
            profile = { id: '123', displayName: 'Mocked User' };
          this._verify('identifier', profile, function(err, user, info) {
            if (err) {
              return self.error(err);
            }
            if (!user) {
              return self.fail(info);
            }
            self.success(user, info);
          });
        });

        request(app)
          .get('/auth/google/callback')
          .expect('Location', /\/login\?googsuccess=1/)
          .expect(302, function(err) {
            authenticateStub.restore();
            done(err);
          });
      });
    });
  });
});
