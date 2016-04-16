module.exports.clean = function (o) {
    return o;
};

module.exports.export = function (o) {
    delete o._id;
    delete o.__v;
    delete o.has;
    delete o.allowed;
    return o;
};