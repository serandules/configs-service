var validators = require('validators');
var Configs = require('model-configs');

exports.find = function (req, res, next) {
  validators.query(req, res, function (err) {
    if (err) {
      return next(err);
    }
    validators.find({
      model: Configs
    }, req, res, next);
  });
};

exports.findOne = function (req, res, next) {
    validators.findOne({
        id: req.params.id,
        model: Configs
    }, req, res, next);
};