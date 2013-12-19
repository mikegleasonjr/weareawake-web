var express = require('express'),
  exphbs = require('express3-handlebars'),
  routes = require('./routes'),
  http = require('http'),
  app = express(),
  i18n = require('i18n-2'),
  url = require('url');

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

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.enable('trust proxy');
app.use(function(req, res, next){
  if (/^([^.]+)/.test(req.headers.host) && RegExp.$1 === 'en') {
    return res.redirect(301, url.resolve('http://' + req.headers.host.substring(3), req.url));
  }
  next();
});
i18n.expressBind(app, {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  subdomain: true,
  query: false
});
app.use(express.responseTime());
if (app.get('env') == 'development') {
  app.use('/static', express.static('static'));
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
}

app.get('/', routes.index);

app.listen(8000);
