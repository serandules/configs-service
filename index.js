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
            res.status(500).send([{
                code: 500,
                message: 'Internal Server Error'
            }]);
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
                log.error(err);
                res.status(500).send([{
                    code: 500,
                    message: 'Internal Server Error'
                }]);
                return;
            }
            if (!config) {
                res.status(404).send([{
                    code: 404,
                    message: 'Config Not Found'
                }]);
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
                log.error(err);
                res.status(500).send([{
                    code: 500,
                    message: 'Internal Server Error'
                }]);
                return;
            }
            res.send(parse(configs));
        });
});

router.delete('/configs/:id', function (req, res) {
    if (!mongutils.objectId(req.params.id)) {
        res.status(404).send([{
            code: 404,
            message: 'Config Not Found'
        }]);
        return;
    }
    Config.findOne({
        _id: req.params.id
    }).exec(function (err, config) {
        if (err) {
            log.error(err);
            res.status(500).send([{
                code: 500,
                message: 'Internal Server Error'
            }]);
            return;
        }
        if (!config) {
            res.status(404).send([{
                code: 404,
                message: 'Config Not Found'
            }]);
            return;
        }
        config.remove();
        res.status(204).end();
    });
});

