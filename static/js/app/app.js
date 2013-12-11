var button = document.getElementById('say');

if (button) {
  button.addEventListener('click', function (e) {
    var message = prompt('Say Something:', 'Yo yo'),
      echo    = document.createElement('div');

    if (!message) { return; }

    echo.innerHTML = Handlebars.partials['test/echo']({message: message});
    document.body.appendChild(echo);
  }, false);
}

var app = app || {};
app.widgets = app.widgets || {};

// widget
/////////////////////////////////

app.widgets.widget = function(partialName) {
  this.partialName = partialName;
};

app.widgets.widget.prototype.create = function(container, context){
  if (!Handlebars.partials.hasOwnProperty(this.partialName)) {
    throw 'partial "' + this.partialName + '" not found';
  }

  var partial = Handlebars.partials[this.partialName];
  var $container = $(container);

  if ($container.length !== 1) {
    throw 'none or multiple container found';
  }

  this.context = context || {};
  this.container = $container.append(partial(context));
};

app.widgets.widget.prototype.attach = function(container, context) {
  var $container = $(container);

  if ($container.length !== 1) {
    throw 'multiple container found';
  }

  this.context = context || {};
  this.container = $container;
};


// widget:map
/////////////////////////////////

app.widgets.map = function() {};
app.widgets.map.prototype = new app.widgets.widget('widgets/map');
app.widgets.map.prototype.create = function(container, context) {
  app.widgets.widget.prototype.create.call(this, container, context);
  this.show();
};
app.widgets.map.prototype.attach = function(container, context) {
  app.widgets.widget.prototype.attach.call(this, container, context);
  this.show();
};
app.widgets.map.prototype.show = function() {
  var mapOptions = {
    center: new google.maps.LatLng(45.5086699, -73.55399249999999),
    zoom: 8,
    scrollwheel: false,
    backgroundColor: '#FFF'
  };
  var map = new google.maps.Map(this.container[0], mapOptions);
};
