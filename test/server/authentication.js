var request = require('supertest'),
  should = require('should'),
  sinon = require('sinon'),
  passeport = require('passport'),
  app = require('../../app'),
  redis = require('redis'),
  config = require('../../lib/config'),
  cache = redis.createClient(config.get('CACHE_PORT'), config.get('CACHE_HOST'));


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
      var sessionId = null,
        sessionUser = null,
        authenticateStub = null;

      before(function() {
        sessionId = sessionUser = null;
        authenticateStub = sinon.stub(passeport._strategies.facebook, 'authenticate', function(req) {
          sessionId = req.sessionID;
          this._verify('accessToken', 'refreshToken', { id: 12345678, displayName: 'Mocked User' }, function(err, user, info) {
            if (err) return this.error(err);
            if (!user) return this.fail(info);
            sessionUser = user;
            this.success(user, info);
          }.bind(this));
        });
      });

      after(function() {
        authenticateStub.restore();
      });

      it('should redirect to the authentication succeeded page', function(done) {
        request(app)
          .get('/auth/facebook/callback?code=AQCPxK0FjCQu...')
          .expect('Location', /\/login\?fbsuccess=1/)
          .expect(302, done);
      });

      it('should keep the user in cache', function(done) {
        request(app)
          .get('/auth/facebook/callback?code=AQCPxK0FjCQu...')
          .end(function() {
            cache.get('sess:' + sessionId, function(err, reply) {
              reply.should.be.type('string');
              JSON.parse(reply).passport.user.should.equal(sessionUser.id);
              done(err);
            });
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
      var sessionId = null,
        sessionUser = null,
        authenticateStub = null;

      before(function() {
        sessionId = sessionUser = null;
        authenticateStub = sinon.stub(passeport._strategies.twitter, 'authenticate', function(req) {
          sessionId = req.sessionID;
          this._verify('token', 'tokenSecret', { id: 12345678, displayName: 'Mocked User' }, function(err, user, info) {
            if (err) return this.error(err);
            if (!user) return this.fail(info);
            sessionUser = user;
            this.success(user, info);
          }.bind(this));
        });
      });

      after(function() {
        authenticateStub.restore();
      });

      it('should redirect to the authentication succeeded page', function(done) {
        request(app)
          .get('/auth/twitter/callback?oauth_token=abv&oauth_verifier=xyz')
          .expect('Location', /\/login\?twsuccess=1/)
          .expect(302, done);
      });

      it('should keep the user in cache', function(done) {
        request(app)
          .get('/auth/twitter/callback?oauth_token=abv&oauth_verifier=xyz')
          .end(function() {
            cache.get('sess:' + sessionId, function(err, reply) {
              JSON.parse(reply).passport.user.should.equal(sessionUser.id);
              reply.should.be.type('string');
              done(err);
            });
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
      var sessionId = null,
        sessionUser = null,
        authenticateStub = null;

      before(function() {
        sessionId = sessionUser = null;
        authenticateStub = sinon.stub(passeport._strategies.google, 'authenticate', function(req) {
          sessionId = req.sessionID;
          this._verify('identifier', { id: 12345678, displayName: 'Mocked User' }, function(err, user, info) {
            if (err) return this.error(err);
            if (!user) return this.fail(info);
            sessionUser = user;
            this.success(user, info);
          }.bind(this));
        });
      });

      after(function() {
        authenticateStub.restore();
      });

      it('should redirect to the authentication succeeded page', function(done) {
        request(app)
          .get('/auth/google/callback')
          .expect('Location', /\/login\?googsuccess=1/)
          .expect(302, done);
      });

      it('should keep the user in cache', function(done) {
        request(app)
          .get('/auth/google/callback')
          .end(function() {
            cache.get('sess:' + sessionId, function(err, reply) {
              JSON.parse(reply).passport.user.should.equal(sessionUser.id);
              done(err);
            });
          });
      });
    });
  });
});
