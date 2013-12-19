var app = app || {};
app.widgets = app.widgets || {};

(function(){
  "use strict";

  app.widgets.Widget = function(partialName) {
    this.partialName = partialName;
  };

  app.widgets.Widget.prototype.create = function(container, context){
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

  app.widgets.Widget.prototype.attach = function(container, context) {
    var $container = $(container);

    if ($container.length !== 1) {
      throw 'multiple container found';
    }

    this.context = context || {};
    this.container = $container;
  };
})();
