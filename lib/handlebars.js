var exphbs = require('express3-handlebars'),
  hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: './views/partials/',
  layoutsDir: './views/layouts/',
  helpers: {
    debug: function(optionalValue) {
      console.log("Current Context");
      console.log("====================");
      console.log(this);

      if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
      }
    },
    block: function (name) {
      var blocks  = this._blocks;
      var content = blocks && blocks[name];
      return content ? content.join('\n') : null;
    },
    content: function (name, options) {
      var blocks = this._blocks || (this._blocks = {}),
        block  = blocks[name] || (blocks[name] = []);
      block.push(options.fn(this));
    },
    widget: function(context, options) {
      if (!options) {
        options = context;
        context = {};
      }
      var widgets = this._widgets || (this._widgets = []);
      var id = widgets.length + 1;
      widgets.push({ id: 'widget-' + id, js: options.hash.js, context: context });
      return '<div class="' + options.hash.cssclass + '" id="widget-' + id + '">' + options.fn(this) + '</div>';
    },
    widgetBinder: function() {
      var init = '';
      var widgets = this._widgets || [];
      for(var i = 0; i < widgets.length; i++) {
        var w = widgets[i];
        init += 'new ' + w.js + '().attach(document.getElementById("' + w.id + '"), ' + JSON.stringify(w.context) +');';
      }
      return '<script>$(document).ready(function(){'+ init +'});</script>';
    }
  }
});

module.exports = {
  bind: function(app) {
    app.engine('handlebars', hbs.engine);
    app.set('view engine', 'handlebars');
  }
};
