var views = {};

views.index = function(req, res) {
  res.set('X-Forwarded-To', req.ip);
  res.json(200, { 'status': 'OK' });
};

module.exports = views;
