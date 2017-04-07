var nconf = require('nconf');

nconf.overrides({
    'services': [
        {"name": "service-configs", "version": "master", "domain": "accounts", "prefix": "/apis/v/configs"}
    ]
});