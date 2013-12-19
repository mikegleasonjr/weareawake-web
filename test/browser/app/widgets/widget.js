describe('app.widgets.Widget', function() {
  "use strict";

  describe('#create()', function() {
    it('should throw when the container is not a DOM node', function() {
      var shouldBeDOMNode = /container should be a DOM node/;
      var creatingWith = function(container) {
        return function() {
          new app.widgets.Widget().create(container);
        };
      };

      creatingWith(undefined).should.throw(shouldBeDOMNode);
      creatingWith({}).should.throw(shouldBeDOMNode);
      creatingWith([]).should.throw(shouldBeDOMNode);
      creatingWith($('<div></div>')).should.throw(shouldBeDOMNode);
      creatingWith($('<div></div>')[0]).should.not.throw();
    });
  });

  describe('#getContainer()', function() {
    it('should return the current widget container', function() {
      var container = $('<div></div>')[0];
      var widget = new app.widgets.Widget();

      widget.create(container);
      widget.getContainer().should.equal(container);
    });
  });

  describe('#show()', function() {
    it('should throw an error explaining that widgets should override this method', function() {
      var widget = new app.widgets.Widget();
      widget.show.should.throw(/widgets must override the show method/);
    });
  });
});
