var app = app || {};
app.widgets = app.widgets || {};

(function() {
  "use strict";

  app.widgets.Handlebars = function(partialName) {
    if (typeof partialName != 'string') {
      throw new Error('partialName should be a string');
    }

    this._partialName = partialName;
    this._context = {};
  };

  app.widgets.Handlebars.prototype = new app.widgets.Widget();

  app.widgets.Handlebars.prototype.getPartialName = function() {
    return this._partialName;
  };

  app.widgets.Handlebars.prototype.getContext = function() {
    return this._context;
  };

  /*
   app.widgets.Handlebars.prototype.create = function(container, context){
   app.widgets.Widget.prototype.create.call(this, container);

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
   */

  app.widgets.Handlebars.prototype.attach = function(container, context) {
    this._setContainer(container);
    this._context = context;
    this.onAttach();
    /*
     var $container = $(container);

     if ($container.length !== 1) {
     throw 'multiple container found';
     }

     this.context = context || {};
     this.container = $container;
     */
  };

  app.widgets.Handlebars.prototype.onAttach = function() {
    throw new Error('widgets must override the onAttach method');
  };
})();
