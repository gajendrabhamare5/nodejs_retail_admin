// prefixRoutes.js
module.exports = function (prefix) {
    return function (req, res, next) {
        req.originalUrl = `${prefix}${req.originalUrl}`;
        next();
    };
};
