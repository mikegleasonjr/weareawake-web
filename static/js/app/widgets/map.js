var app = app || {};
app.widgets = app.widgets || {};

(function(){
  "use strict";

  app.widgets.Map = function() {};
  app.widgets.Map.prototype = new app.widgets.Widget('widgets/map');
  app.widgets.Map.prototype.create = function(container, context) {
    app.widgets.Widget.prototype.create.call(this, container, context);
    this.show();
  };
  app.widgets.Map.prototype.attach = function(container, context) {
    app.widgets.Widget.prototype.attach.call(this, container, context);
    this.show();
  };
  app.widgets.Map.prototype.show = function() {
    var self = this;

    app.googlemaps.Loader.instance.onLoad(function() {
      var mapOptions = {
        center: new google.maps.LatLng(45.5086699, -73.55399249999999),
        zoom: 8,
        scrollwheel: false,
        backgroundColor: '#FFF'
      };
      new google.maps.Map(self.container[0], mapOptions);
    });
  };
})();
