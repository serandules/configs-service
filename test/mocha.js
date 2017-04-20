var nconf = require('nconf');

nconf.overrides({
    'services': [
        {"path": __dirname + '/..', "domain": "accounts", "prefix": "/apis/v/configs"}
    ]
});