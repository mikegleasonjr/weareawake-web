var request = require('supertest'),
  should = require('should'),
  cookie = require('cookie'),
  app = require('../../app');


describe('integration', function() {
  describe('when requesting resource /heartbeat', function() {
    it('should respond 200', function(done) {
      request(app)
        .get('/heartbeat')
        .expect('Content-Type', /json/)
        .expect(200, { 'status': 'OK' }, done);
    });
  });

  describe('when requesting resource /heartbeat/', function() {
    it('should do strict routing', function(done) {
      request(app)
        .get('/heartbeat/')
        .expect(404, done);
    });
  });

  describe('when requesting a resource', function() {
    it('must have reverse proxy support', function(done) {
      request(app)
        .get('/heartbeat')
        .set('X-Forwarded-For', '1.2.3.4')
        .expect('X-Forwarded-To', '1.2.3.4', done);
    });

    it('should give the response time in the headers', function(done) {
      request(app)
        .get('/heartbeat')
        .expect('X-Response-Time', /[0-9]+ms/)
        .end(done);
    });
  });

  describe('when requesting a resource in english', function() {
    it('should set the language in the headers/cookies', function(done) {
      request(app)
        .get('/heartbeat')
        .set('host', 'en.weareawake.net')
        .expect('Set-Cookie', /preferredLocale=.*en\./)
        .expect('Content-Language', 'en', done);
    });
  });

  describe('when requesting a resource in french', function() {
    it('should set the language in the headers/cookies', function(done) {
      request(app)
        .get('/heartbeat')
        .set('host', 'fr.weareawake.net')
        .expect('Set-Cookie', /preferredLocale=[a-zA-Z0-9%.]+fr\.[a-zA-Z0-9%.]+; Domain=\.weareawake\.net; Path=\//)
        .expect('Content-Language', 'fr', done);
    });
  });

  describe('when requesting a resource', function() {
    it('should set a session cookie', function(done) {
      request(app)
        .get('/heartbeat')
        .expect('Set-Cookie', new RegExp('sessionId=[a-zA-Z0-9%.]+; Domain=\\.weareawake\\.net; Path=\\/; Expires=' + new Date(new Date().getTime() + 30 * 60 * 1000).toUTCString() + '; HttpOnly'), done);
    });
  });

  describe('when requesting a resource on the naked domain', function() {
    it('should redirect to english by default', function(done) {
      request(app)
        .get('/heartbeat?query=1')
        .set('host', 'weareawake.net')
        .expect('Location', 'http://en.weareawake.net/heartbeat?query=1')
        .expect(301, done);
    });

    it('should redirect to the last browsed language', function(done) {
        checkLastBrowsedCookie = function(frenchCookie) {
          request(app)
            .get('/heartbeat')
            .set('host', 'weareawake.net')
            .set('Cookie', 'preferredLocale=' + frenchCookie)
            .expect('Location', 'http://fr.weareawake.net/heartbeat')
            .expect(301, done);
        };

      request(app)
        .get('/heartbeat')
        .set('host', 'fr.weareawake.net')
        .end(function(err, res) {
          checkLastBrowsedCookie(cookie.parse(res.headers['set-cookie'][0]).preferredLocale);
        });
    });
  });

  describe('when requesting a page in french', function() {
    it('should specify lang=fr in the html tag', function(done) {
      request(app)
        .get('/')
        .set('host', 'fr.weareawake.net')
        .expect(200, /<html lang="fr">/, done);
    });
  });

  describe('when requesting a page in english', function() {
    it('should specify lang=en in the html tag', function(done) {
      request(app)
        .get('/')
        .set('host', 'en.weareawake.net')
        .expect(200, /<html lang="en">/, done);
    });
  });
});
