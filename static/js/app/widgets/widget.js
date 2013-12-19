var app = app || {};
app.widgets = app.widgets || {};

(function() {
  "use strict";

  app.widgets.Widget = function() {
    this._container = undefined;
  };

  app.widgets.Widget.prototype.create = function(container) {
    this._setContainer(container);
  };

  app.widgets.Widget.prototype.getContainer = function() {
    return this._container;
  };

  app.widgets.Widget.prototype.show = function() {
    throw new Error('widgets must override the show method');
  };

  // private

  app.widgets.Widget.prototype._setContainer = function(container) {
    if (!(container instanceof HTMLElement)) {
      throw new Error('container should be a DOM node');
    }

    this._container = container;
  };
})();
