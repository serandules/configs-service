var log = require('logger')('service-configs');
var express = require('express');
var bodyParser = require('body-parser');

var errors = require('errors');
var utils = require('utils');
var Configs = require('model-configs');
var mongutils = require('mongutils');
var auth = require('auth');
var serandi = require('serandi');

var sanitizer = require('./sanitizer');

var paging = {
    start: 0,
    count: 10,
    sort: ''
};

var fields = {
    '*': true
};

var stringify = function (configs) {
    var o = Array.isArray(configs) ? configs : [configs];
    o.forEach(function (config) {
        config.value = JSON.stringify(config.value);
    });
    return configs;
};

var parse = function (configs) {
    var o = Array.isArray(configs) ? configs : [configs];
    o.forEach(function (config) {
        config.value = JSON.parse(config.value);
    });
    return configs;
};

module.exports = function (router) {
    router.use(serandi.pond);
    router.use(serandi.ctx);
    router.use(auth({
        GET: {
            open: [
                '^\/boot$'
            ],
            hybrid: []
        }
    }));
    router.use(bodyParser.json());

    /**
     * {"name": "serandives app"}
     */
    /*router.post('/', function (req, res) {
        Configs.create(stringify(req.body), function (err, config) {
            if (err) {
                log.error(err);
                res.status(500).send({
                    code: errors.serverError,
                    message: 'Internal Server Error'
                });
                return;
            }
            res.send(config);
        });
    });*/

    router.get('/:name', function (req, res) {
        Configs.findOne({
            name: req.params.name
        }).lean()
            .exec(function (err, config) {
                if (err) {
                    log.error(err);
                    return res.pond(errors.serverError());
                }
                if (!config) {
                    return res.pond(errors.notFound());
                }
                res.send(sanitizer.export(parse(config)));
            });
    });


    /**
     * /users?data={}
     */
    /*router.get('/', function (req, res) {
        var data = req.query.data ? JSON.parse(req.query.data) : {};
        sanitizer.clean(data.query || (data.query = {}));
        utils.merge(data.paging || (data.paging = {}), paging);
        utils.merge(data.fields || (data.fields = {}), fields);
        Configs.find(data.query)
            .skip(data.paging.start)
            .limit(data.paging.count)
            .sort(data.paging.sort)
            .lean()
            .exec(function (err, configs) {
                if (err) {
                    log.error(err);
                    res.status(500).send({
                        code: errors.serverError,
                        message: 'Internal Server Error'
                    });
                    return;
                }
                res.send(parse(configs));
            });
    });*/

    /*router.delete('/:id', function (req, res) {
        if (!mongutils.objectId(req.params.id)) {
            res.status(404).send({
                code: errors.notFound,
                message: 'Configs Not Found'
            });
            return;
        }
        Configs.findOne({
            _id: req.params.id
        }).exec(function (err, config) {
            if (err) {
                log.error(err);
                res.status(500).send({
                    code: errors.serverError,
                    message: 'Internal Server Error'
                });
                return;
            }
            if (!config) {
                res.status(404).send({
                    code: errors.notFound,
                    message: 'Configs Not Found'
                });
                return;
            }
            config.remove();
            res.status(204).end();
        });
    });*/
};