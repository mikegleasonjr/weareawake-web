var express = require('express');
var exphbs = require('express3-handlebars');
var routes = require('./routes');
var http = require('http');
var app = express();

app.engine('handlebars', exphbs({
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
    }
  }
}));
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
