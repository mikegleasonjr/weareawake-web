var express = require('express');
var exphbs = require('express3-handlebars');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var app = express();

app.engine('handlebars', exphbs({
  defaultLayout: 'main',
  partialsDir: './views/partials/',
  layoutsDir: './views/layouts/',
  helpers: {
    yell: function(msg) { return msg.toUpperCase(); },
    block: function (name) {
      var blocks  = this._blocks;
      var content = blocks && blocks[name];
      return content ? content.join('\n') : null;
    },
    contentFor: function (name, options) {
      var blocks = this._blocks || (this._blocks = {}),
        block  = blocks[name] || (blocks[name] = []);
      block.push(options.fn(this));
    }
  }
}));

app.set('port', process.env.PORT || 8000);
app.set('view engine', 'handlebars');
app.enable('trust proxy');

if ('development' == app.get('env')) {
//  app.use(express.compress());
  app.use('/static', express.static('static'));
//  app.use(express.logger('dev'));
//  app.use(express.favicon());
//  app.use(express.errorHandler());
}

// Parse application/json request bodies,
// providing the parsed object as req.body.
app.use(express.json());

// Parse x-ww-form-urlencoded request bodies,
// providing the parsed object as req.body.
app.use(express.urlencoded());

// Parse Cookie header and populate req.cookies
// with an object keyed by the cookie names.
//app.use(express.cookieParser('DEV-%nu^$%_-wjuxg%5xtkt5u_q=#)(q)cq9c7u_6*bz%)ld2nbu_l'));
//app.use(express.cookieParser('STAGING-fk9vhy)dyi328twiq@sej0cn9isj_eg2d96(pwh9mosu&^6&+v'));
//app.use(express.cookieParser('PROD-yqd5p35t2oxibif6s*sjkfc93-ahcia22zo8f=vi@(+*)+=+m='));

//app.use(express.cookieParser());
//app.use(express.cookieSession({ 'secret': 'hello' }));

//app.use(express.session({
//  secret: 'DEV-%nu^$%_-wjuxg%5xtkt5u_q=#)(q)cq9c7u_6*bz%)ld2nbu_l',
//  key: 'sid',
//  proxy : true,
//  cookie: {
//    secure: true,
//    maxAge: 5000
//  }
//}));

// To store or access session data,
// simply use the request property req.session
// Session data is not saved in the cookie itself, however
// cookies are used, so we must use the cookieParser()
// middleware before session().
//var hour = 3600000;
//app.use(express.cookieSession({ secret: 'DEV-%nu^$%_-wjuxg%5xtkt5u_q=#)(q)cq9c7u_6*bz%)ld2nbu_l', cookie: { maxAge: 6000 }}));

app.use(app.router);

if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);


app.get('/yell', function (req, res) {
  res.render('yell', {
    title: 'Yell',
    message: 'hello world'
  });
});

app.get('/exclaim', function (req, res) {
  res.render('yell', {
    title  : 'Exclaim',
    message: 'hello world',
    helpers: {
      yell: function (msg) {
        return (msg + '!!!');
      }
    }
  });
});

app.get('/echo/:message?', function (req, res) {
  res.render('echo', {
    title  : 'Echo',
    message: req.params.message
  });
});

app.listen(app.get('port'));
