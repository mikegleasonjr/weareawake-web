var url = require('url'),
  config = require('../config'),
  domain = config.get('DOMAIN'),
  cookiedomain = config.get('COOKIE_DOMAIN');


module.exports = function() {
  return function(req, res, next) {
    if (onNakedDomain(req)) {
      return res.redirect(301, getPreferredLocaleUrl(req));
    }

    var locale = req.i18n.getLocale();

    res.cookie('preferredLocale', locale, { signed: true, domain: cookiedomain, path: '/' });
    res.set('Content-Language', locale);

    next();
  };
};

function onNakedDomain(req) {
  return req.headers &&
    req.headers.host &&
    req.headers.host.indexOf(domain) === 0;
}

function getPreferredLocaleUrl(req) {
  var preferredLocale = req.signedCookies.preferredLocale || 'en';
  return url.resolve('http://' + preferredLocale + '.' + domain, req.url);
}
