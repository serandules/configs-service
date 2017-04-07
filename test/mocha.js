var nconf = require('nconf');

nconf.overrides({
    'services': [
        {"name": "configs-service", "version": "master", "domain": "accounts", "prefix": "/apis/v/configs"}
    ]
});