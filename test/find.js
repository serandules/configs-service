var log = require('logger')('config-service:test:create');
var errors = require('errors');
var should = require('should');
var request = require('request');
var pot = require('pot');

describe('POST /users', function () {
    before(function (done) {
        pot.start(done);
    });

    after(function (done) {
        pot.stop(done);
    });

    it('GET /configs/boot', function (done) {
        request({
            uri: pot.resolve('/apis/v/configs/boot'),
            method: 'GET',
            json: {}
        }, function (e, r, b) {
            if (e) {
                return done(e);
            }
            r.statusCode.should.equal(200);
            should.exist(b);
            should.exist(b.name);
            should.exist(b.value);
            should.exist(b.value.clients);
            should.exist(b.value.clients.serandives);
            done();
        });
    });

    it('GET /configs/other', function (done) {
        request({
            uri: pot.resolve('/apis/v/configs/other'),
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