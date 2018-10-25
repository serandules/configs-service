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

exports.find = function (req, res, next) {
  next();
};

exports.findOne = function (req, res, next) {
  exports.find(req, res, next);
};