var log = require('logger')('service-configs');
var express = require('express');
var bodyParser = require('body-parser');

var errors = require('errors');
var utils = require('utils');
var Configs = require('model-configs');
var mongutils = require('mongutils');
var auth = require('auth');
var throttle = require('throttle');
var serandi = require('serandi');

var pub = require('./public');
var validators = require('./validators');
var sanitizers = require('./sanitizers');

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

    router.get('/:id', validators.findOne, sanitizers.findOne, function (req, res, next) {
      mongutils.findOne(Configs, req.query, function (err, config) {
        if (err) {
          return next(err);
        }
        res.send(config);
      });
    });

    router.get('/', validators.find, sanitizers.find, function (req, res, next) {
      mongutils.find(Configs, req.query.data, function (err, vehicles, paging) {
        if (err) {
          return next(err);
        }
        res.many(vehicles, paging);
      });
    });

    done();
  });
};