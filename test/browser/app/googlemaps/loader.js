describe('app.googlemaps.Loader', function() {
  'use strict';

  describe('#instance', function() {
    it('should be a app.googlemaps.Loader instance (singleton)', function() {
      app.googlemaps.Loader.instance.should.be.an.instanceOf(app.googlemaps.Loader);
    });
  });

  describe('#instance', function() {
    it("should be instanciated with the document's body as the container", function() {
      app.googlemaps.Loader.instance.getScriptContainer().should.equal(document.body);
    });
  });

  describe('#callback()', function() {
    it('should be a global function available for the Google Maps API to call upon load completion', function() {
      app.googlemaps.Loader.callback.should.be.type('function');
    });
  });

  describe('#new', function() {
    it('should throw when the script container is not a DOM node', function() {
      var shouldBeDOMNode = /scriptContainer should be a DOM node/;
      var creatingWith = function(scriptContainer) {
        return function() {
          new app.googlemaps.Loader(scriptContainer);
        };
      };

      creatingWith(undefined).should.throw(shouldBeDOMNode);
      creatingWith({}).should.throw(shouldBeDOMNode);
      creatingWith([]).should.throw(shouldBeDOMNode);
      creatingWith($('<div></div>')).should.throw(shouldBeDOMNode);
      creatingWith($('<div></div>')[0]).should.not.throw();
    });
  });

  describe('#onLoad()', function() {
    it('should insert a script tag in the container to load the Google Maps API', function() {
      var container = $('<div></div>');
      var loader = new app.googlemaps.Loader(container[0]);

      loader.onLoad($.noop);

      container.find('script').length.should.equal(1);
    });
  });

  describe('#onLoad()', function() {
    it('should insert the script only once', function() {
      var container = $('<div></div>');
      var loader = new app.googlemaps.Loader(container[0]);

      loader.onLoad($.noop);
      loader.onLoad($.noop);

      container.find('script').length.should.equal(1);
    });
  });

  describe('#onLoad()', function() {
    it('should insert a script with a valid src attribute', function() {
      var container = $('<div></div>');
      var loader = new app.googlemaps.Loader(container[0]);

      loader.onLoad($.noop);

      container.find('script').attr('src').should.equal('//maps.googleapis.com/maps/api/js?key=AIzaSyBvEyN2z62-Yz62XqI4K9GJnuZxDRQ3e3Q&sensor=false&callback=app.googlemaps.Loader.callback');
    });
  });

  describe('#loaded()', function() {
    it('should be triggered on the singleton when the Google Maps API is loaded', function() {
      var mock = sinon.mock(app.googlemaps.Loader.instance);
      mock.expects('onLoaded').once();

      app.googlemaps.Loader.callback();

      mock.verify();
      mock.restore();
    });
  });

  describe('#onLoad()', function() {
    it('should notify the client that the Google Maps API has been loaded', function() {
      var spy = sinon.spy();
      var container = $('<div></div>');
      var loader = new app.googlemaps.Loader(container[0]);

      loader.onLoad(spy);

      spy.called.should.equal(false);
      loader.onLoaded();
      spy.calledOnce.should.equal(true);
    });
  });

  describe('#onLoad()', function() {
    it('should notify the client immediately if the Google Maps API has already been loaded', function() {
      var spy = sinon.spy();
      var container = $('<div></div>');
      var loader = new app.googlemaps.Loader(container[0]);

      loader.onLoaded();
      loader.onLoad(spy);

      spy.calledOnce.should.equal(true);
    });
  });

  describe('#onLoad()', function() {
    it('should support multiple listeners', function() {
      var spy1 = sinon.spy();
      var spy2 = sinon.spy();
      var spy3 = sinon.spy();
      var container = $('<div></div>');
      var loader = new app.googlemaps.Loader(container[0]);

      loader.onLoad(spy1);
      loader.onLoad(spy2);

      spy1.calledOnce.should.equal(false);
      spy2.calledOnce.should.equal(false);

      loader.onLoaded();

      spy1.calledOnce.should.equal(true);
      spy2.calledOnce.should.equal(true);

      spy3.calledOnce.should.equal(false);

      loader.onLoad(spy3);

      spy3.calledOnce.should.equal(true);
    });
  });
});
