var _ = require('lodash');
var utils = require('utils');
var Users = require('model-users');
var Configs = require('model-configs');

exports.find = function (done) {
  Users.findOne({
    email: utils.root()
  }, function (err, root) {
    if (err) {
      return done(err);
    }
    if (!root) {
      return done(new Error('!root'));
    }
    Configs.find({
      name: {$in: ['boot', 'boot-autos', 'groups', 'menus']},
      user: root.id
    }, function (err, configs) {
      if (err) {
        return done(err);
      }
      var menuz = _.find(configs, function (config) {
        return config.name === 'menus';
      });
      var ids = [];
      Object.keys(menuz.value).forEach(function (menu) {
        ids.push(menuz[menu]);
      });
      Configs.find({
        id: {$in: ids},
        user: root.id
      }, function (err, menus) {
        if (err) {
          return done(err);
        }
        done(null, configs.concat(menus));
      });
    });
  });
};
