module.exports.clean = function (o) {
    return o;
};

module.exports.export = function (o) {
    o = o.toJSON();
    delete o._id;
    delete o.__v;
    delete o.has;
    delete o.allowed;
    return o;
};