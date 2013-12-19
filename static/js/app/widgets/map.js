var app = app || {};
app.widgets = app.widgets || {};

(function(){
  "use strict";

  app.widgets.Map = function() {};

  app.widgets.Map.prototype = new app.widgets.Handlebars('widgets/map');

  app.widgets.Map.prototype.onAttach = function() {
    app.googlemaps.Loader.instance.onLoad(function() {
      var mapOptions = {
        center: new google.maps.LatLng(45.5086699, -73.55399249999999),
        zoom: 8,
        scrollwheel: false,
        backgroundColor: '#FFF'
      };
      new google.maps.Map(this.getContainer(), mapOptions);
    }.bind(this));
  };
})();
