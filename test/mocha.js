var nconf = require('nconf');

nconf.overrides({
    "SERVICE_CLIENTS": "master:accounts:/apis/v/clients",
    "SERVICE_USERS": "master:accounts:/apis/v/users",
    "SERVICE_TOKENS": "master:accounts:/apis/v/tokens",
    "LOCAL_CONFIGS": __dirname + "/..:www:/apis/v/configs"
});

require('pot');
