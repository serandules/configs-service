var log = require('logger')('config-service');
var utils = require('utils');
var Config = require('config');
var mongoose = require('mongoose');
var mongutils = require('mongutils');
var sanitizer = require('./sanitizer');

var express = require('express');
var router = express.Router();

module.exports = router;

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

/**
 * {"name": "serandives app"}
 */
router.post('/configs', function (req, res) {
    Config.create(stringify(req.body), function (err, config) {
        if (err) {
            log.error(err);
            res.status(500).send({
                error: true
            });
            return;
        }
        res.send(config);
    });
});

router.get('/configs/:name', function (req, res) {
    Config.findOne({
        name: req.params.name
    }).lean()
        .exec(function (err, config) {
            if (err) {
                log.error('config find error');
                res.status(500).send({
                    error: true
                });
                return;
            }
            if (!config) {
                res.status(404).send({
                    error: true
                });
                return;
            }
            res.send(sanitizer.export(parse(config)));
        });
});


/**
 * /users?data={}
 */
router.get('/configs', function (req, res) {
    var data = req.query.data ? JSON.parse(req.query.data) : {};
    sanitizer.clean(data.criteria || (data.criteria = {}));
    utils.merge(data.paging || (data.paging = {}), paging);
    utils.merge(data.fields || (data.fields = {}), fields);
    Config.find(data.criteria)
        .skip(data.paging.start)
        .limit(data.paging.count)
        .sort(data.paging.sort)
        .lean()
        .exec(function (err, configs) {
            if (err) {
                //TODO: send proper HTTP code
                log.error('config find error');
                res.status(500).send({
                    error: true
                });
                return;
            }
            res.send(parse(configs));
        });
});

router.delete('/configs/:id', function (req, res) {
    if (!mongutils.objectId(req.params.id)) {
        res.status(404).send({
            error: 'specified config cannot be found'
        });
        return;
    }
    Config.findOne({
        _id: req.params.id
    })
        .exec(function (err, config) {
            if (err) {
                log.error('config find error');
                res.status(500).send({
                    error: 'error while retrieving config'
                });
                return;
            }
            if (!config) {
                res.status(404).send({
                    error: 'specified config cannot be found'
                });
                return;
            }
            config.remove();
            res.send({
                error: false
            });
        });
});

