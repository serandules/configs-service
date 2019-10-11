var log = require('logger')('service-configs:test:create');
var nconf = require('nconf');
var errors = require('errors');
var should = require('should');
var request = require('request');
var async = require('async');
var pot = require('pot');

describe('GET /configs', function () {
  var client;
  before(function (done) {
    pot.client(function (err, c) {
      if (err) {
        return done(err);
      }
      client = c;
      done();
    });
  });

  it('anonymous', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/configs'),
      method: 'GET',
      json: true
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(200);
      should.exist(b);
      should.exist(b.length);
      b.forEach(function (config) {
        if (config.name.indexOf('menus-') === 0 || config.name.indexOf('tests-') === 0) {
          return;
        }
        ['boot', 'groups', 'menus'].indexOf(config.name).should.be.above(-1);
      });
      done();
    });
  });

  it('admin', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/configs'),
      method: 'GET',
      auth: {
        bearer: client.admin.token
      },
      json: true
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(200);
      should.exist(b);
      should.exist(b.length);
      b.forEach(function (config) {
        if (config.name.indexOf('menus-') === 0 || config.name.indexOf('tests-') === 0) {
          return;
        }
        ['boot', 'groups', 'menus'].indexOf(config.name).should.be.above(-1);
      });
      done();
    });
  });

  it('authenticated', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/configs'),
      method: 'GET',
      auth: {
        bearer: client.users[0].token
      },
      json: true
    }, function (e, r, b) {
      if (e) {
        return done(e);
      }
      r.statusCode.should.equal(200);
      should.exist(b);
      should.exist(b.length);
      b.forEach(function (config) {
        if (config.name.indexOf('menus-') === 0 || config.name.indexOf('tests-') === 0) {
          return;
        }
        ['boot', 'groups', 'menus'].indexOf(config.name).should.be.above(-1);
      });
      done();
    });
  });
});
