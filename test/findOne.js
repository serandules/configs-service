var log = require('logger')('service-configs:test:create');
var nconf = require('nconf');
var errors = require('errors');
var should = require('should');
var request = require('request');
var async = require('async');
var pot = require('pot');
var pub = require('../public');

describe('GET /configs/:id', function () {
  var configs;

  var find = function (name) {
    var i;
    var config;
    for (i = 0; i < configs.length; i++) {
      config = configs[i];
      if (config.name === name) {
        return config;
      }
    }
    return null;
  };

  before(function (done) {
    pub.find(function (err, b) {
      if (err) {
        return done(err);
      }
      configs = b;
      done();
    })
  });

  it('GET /configs/boot', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/configs/' + find('boot').id),
      method: 'GET',
      json: true
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(200);
      should.exist(b);
      should.exist(b.name);
      b.name.should.equal('boot');
      should.exist(b.value);
      should.exist(b.value.clients);
      should.exist(b.value.clients.serandives);
      done();
    });
  });

  it('GET /configs/groups', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/configs/' + find('groups').id),
      method: 'GET',
      json: true
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(200);
      should.exist(b);
      should.exist(b.name);
      b.name.should.equal('groups');
      should.exist(b.value);
      should.exist(b.value.length);
      b.value.length.should.equal(3);
      b.value.forEach(function (group) {
        should.exist(group.name);
        ['public', 'anonymous', 'admin'].indexOf(group.name).should.not.equal(-1);
      });
      done();
    });
  });

  it('GET /configs/other', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/configs/other'),
      method: 'GET',
      json: {}
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(errors.unauthorized().status);
      should.exist(b);
      b.code.should.equal(errors.unauthorized().data.code);
      done();
    });
  });
});
