var url = require('url');

 module.exports = function() {
  return function(req, res, next) {
    if (onNakedDomain(req)) {
      return res.redirect(301, getDefaultLanguageUrl(req));
    }

    res.set('Content-Language', req.i18n.getLocale());
    next();
  };
};

function onNakedDomain(req) {
  return req.headers &&
    req.headers.host &&
    req.headers.host.indexOf('weareawake.') === 0;
}

function getDefaultLanguageUrl(req) {
  return url.resolve('http://en.' + req.headers.host, req.url);
}
