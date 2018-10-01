var log = require('logger')('service-configs:test:create');
var errors = require('errors');
var should = require('should');
var request = require('request');
var async = require('async');
var pot = require('pot');

describe('GET /configs', function () {
  it('GET /configs/boot', function (done) {
    request({
      uri: pot.resolve('accounts', '/apis/v/configs/boot'),
      method: 'GET',
      json: {}
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
      uri: pot.resolve('accounts', '/apis/v/configs/groups'),
      method: 'GET',
      json: {}
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
      b.value.length.should.equal(1);
      var group = b.value[0];
      should.exist(group.name);
      group.name.should.equal('public');
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