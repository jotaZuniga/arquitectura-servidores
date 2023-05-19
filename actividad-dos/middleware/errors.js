const mongoose = require('mongoose');

const errorHandler = (err, req, res, next) => {
    if (err instanceof mongoose.Error.ValidationError) {
        return res.status(400).json(err.errors);
    }
    
    res.status(500).json({error: 'Internal Server Error'});
};

module.exports = errorHandler;