var nconf = require('nconf');

nconf.overrides({
    "LOCAL_CONFIGS": __dirname + "/..:accounts:/apis/v/configs"
});