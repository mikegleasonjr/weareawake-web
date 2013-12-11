var express = require('express');
var exphbs = require('express3-handlebars');
var routes = require('./routes');
var http = require('http');
var app = express();
var hbs = exphbs.create({
  defaultLayout: 'main',
  partialsDir: './views/partials/',
  layoutsDir: './views/layouts/',
  helpers: {
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
      console.log(context);
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
        init += 'new ' + w.js + '().attach("#' + w.id + '", ' + JSON.stringify(w.context) +');';
      }
      return '<script>$(document).ready(function(){'+ init +'});</script>';
    }
  }
});
hbs.handlebars.registerPartial('template', function(name, y, z) {
  console.log(name, y.partials);
  return '<div>template!</div>';
});


app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.enable('trust proxy');

app.locals({
  pkg: require('./package.json')
});

app.use(express.responseTime());

if ('development' == app.get('env')) {
  app.use('/static', express.static('static'));
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.listen(8000);
