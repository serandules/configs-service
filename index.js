var log = require('logger')('service-configs');
var bodyParser = require('body-parser');

var Configs = require('model-configs');
var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');

var model = require('model');

var pub = require('./public');

var parse = function (configs) {
    var o = Array.isArray(configs) ? configs : [configs];
    o.forEach(function (config) {
        config.value = JSON.parse(config.value);
    });
    return configs;
};

module.exports = function (router, done) {
  pub.find(function (err, configs) {
    if (err) {
      return done(err);
    }
    var allowed = ['^\/$'];
    configs.forEach(function (config) {
      allowed.push('^\/' + config.id + '$');
    });
    router.use(serandi.many);
    router.use(serandi.ctx);
    router.use(auth({
      GET: allowed
    }));
    router.use(throttle.apis('configs'));
    router.use(bodyParser.json());

    router.get('/:id',
      serandi.findOne(Configs),
      function (req, res, next) {
      model.findOne(req.ctx, function (err, config) {
        if (err) {
          return next(err);
        }
        res.send(config);
      });
    });

    router.get('/',
      serandi.find(Configs),
      function (req, res, next) {
      model.find(req.ctx, function (err, configs, paging) {
        if (err) {
          return next(err);
        }
        res.many(configs, paging);
      });
    });

    done();
  });
};