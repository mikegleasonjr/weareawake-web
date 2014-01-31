var request = require('supertest'),
  should = require('should'),
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
    it('should reflect in the headers', function(done) {
      request(app)
        .get('/heartbeat')
        .set('host', 'en.weareawake.net')
        .expect('Content-Language', 'en', done);
    });
  });

  describe('when requesting a resource in french', function() {
    it('should reflect in the headers', function(done) {
      request(app)
        .get('/heartbeat')
        .set('host', 'fr.weareawake.net')
        .expect('Content-Language', 'fr', done);
    });
  });

  describe('when requesting a resource on the naked domain', function() {
    it('should redirect to english', function(done) {
      request(app)
        .get('/heartbeat?query=1')
        .set('host', 'weareawake.net')
        .expect('Location', 'http://en.weareawake.net/heartbeat?query=1')
        .expect(301, done);
    });
  });
});
