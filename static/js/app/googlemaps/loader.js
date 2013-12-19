var app = app || {};
app.googlemaps = app.googlemaps || {};

(function() {
  "use strict";

  app.googlemaps.Loader = function(scriptContainer) {
    if (!(scriptContainer instanceof HTMLElement)) {
      throw new Error('scriptContainer should be a DOM node');
    }

    this._scriptContainer = scriptContainer;
    this._scriptNode = null;
    this._listeners = [];
    this._loaded = false;
  };

  app.googlemaps.Loader.prototype.getScriptContainer = function() {
    return this._scriptContainer;
  };

  app.googlemaps.Loader.prototype.onLoad = function(callback) {
    if (!this._scriptNode) {
      this._scriptNode = document.createElement('script');
      this._scriptNode.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyBvEyN2z62-Yz62XqI4K9GJnuZxDRQ3e3Q&sensor=false&callback=app.googlemaps.Loader.callback';
      this._scriptContainer.appendChild(this._scriptNode);
    }

    if (this._loaded) {
      callback();
    }
    else {
      this._listeners.push(callback);
    }
  };

  app.googlemaps.Loader.prototype.onLoaded = function() {
    this._loaded = true;
    while (this._listeners.length) {
      this._listeners.pop()();
    }
  };

  // singleton globals

  app.googlemaps.Loader.callback = function() {
    app.googlemaps.Loader.instance.onLoaded();
  };

  app.googlemaps.Loader.instance = new app.googlemaps.Loader(document.body);
})();
