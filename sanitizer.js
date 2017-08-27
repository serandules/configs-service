module.exports.clean = function (o) {
    return o;
};

module.exports.found = function (o) {
    delete o._id;
    delete o.__v;
    delete o.user;
    delete o.permissions;
    return o;
};