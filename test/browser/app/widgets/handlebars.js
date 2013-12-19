describe('app.widgets.Handlebars', function() {
  'use strict';

  describe('#new', function() {
    it('should derive from widget', function() {
      var hbw = new app.widgets.Handlebars('partial/name');
      hbw.should.be.an.instanceOf(app.widgets.Widget);
    });

    it('should specify a handlebars partial upon creation', function() {
      var shouldBeAString = /partialName should be a string/;
      var creatingWith = function(partialName) {
        return function() {
          new app.widgets.Handlebars(partialName);
        };
      };

      creatingWith(undefined).should.throw(shouldBeAString);
      creatingWith({}).should.throw(shouldBeAString);
      creatingWith([]).should.throw(shouldBeAString);
      creatingWith('partial/name').should.not.throw();
    });
  });

  describe('#getPartialName()', function() {
    it('should return the widget\'s handlebars partial name', function() {
      var hbw = new app.widgets.Handlebars('cool/widget');
      hbw.getPartialName().should.equal('cool/widget');
    });
  });

  describe('#getContext()', function() {
    it('should be an empty dictionary right after widget instanciation', function() {
      var hbw = new app.widgets.Handlebars('cool/widget');
      hbw.getContext().should.eql({});
    });
  });

  describe('#attach()', function() {
    it('should throw when the container is not a DOM node', function() {
      var shouldBeDOMNode = /container should be a DOM node/;
      var attachingWith = function(container) {
        return function() {
          var hbw = new app.widgets.Handlebars('cool/widget');
          sinon.stub(hbw, 'onAttach');
          hbw.attach(container);
        };
      };

      attachingWith(undefined).should.throw(shouldBeDOMNode);
      attachingWith({}).should.throw(shouldBeDOMNode);
      attachingWith([]).should.throw(shouldBeDOMNode);
      attachingWith($('<div></div>')).should.throw(shouldBeDOMNode);
      attachingWith($('<div></div>')[0]).should.not.throw();
    });
  });

  describe('#attach()', function() {
    it('should keep track of the container', function() {
      var container = $('<div></div>')[0];
      var hbw = new app.widgets.Handlebars('cool/widget');
      sinon.stub(hbw, 'onAttach');

      hbw.attach(container);
      hbw.getContainer().should.equal(container);
    });
  });

  describe('#attach()', function() {
    it('should keep track of the context', function() {
      var container = $('<div></div>')[0];
      var hbw = new app.widgets.Handlebars('cool/widget');
      var context = { 'test': 1 };
      sinon.stub(hbw, 'onAttach');

      hbw.attach(container, context);
      hbw.getContext().should.eql(context);
    });
  });

  describe('#attach()', function() {
    it('should call onAttach() to notify the widget of an attachment', function() {
      var container = $('<div></div>')[0];
      var hbw = new app.widgets.Handlebars('cool/widget');
      var onAttachMock = sinon.mock(hbw);

      onAttachMock.expects('onAttach').once();

      hbw.attach(container);

      onAttachMock.verify();
    });
  });

  describe('#onAttach()', function() {
    it('should throw an error explaining that widgets should override this method', function() {
      var hbw = new app.widgets.Handlebars('cool/widget');
      hbw.onAttach.should.throw(/widgets must override the onAttach method/);
    });
  });
});
