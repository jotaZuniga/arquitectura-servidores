const createError = require('http-errors');

const notFoundError = (req, res, next) => {
    console.log(req.url);
    next(createError(404, 'Route not found'))
}

module.exports = notFoundError;