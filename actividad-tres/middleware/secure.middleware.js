require('dotenv').config();
const User = require('../Models/user.model');
const jwt = require('jsonwebtoken');

const sessions = {};

module.exports.sessions = sessions;

module.exports.auth = (req,res, next) => {
    try {
        const token = req.headers.authorization.split('Bearer ')[1];
        const { sub } = jwt.verify(token, process.env.JWT_KEY || 'secret key');

        if(sub) {
            User.findById(sub).then(user => {
                if (user) {
                    req.user = user;
                    next()
                } else {
                    res.status(401).json({code: 'unauthorized', error: 'User not found'});
                }
            }).catch(next);
        }else {
            res.status(401).json({code: 'unauthorized', error: 'Session not found'});
        }
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            return res.status(401).json({code: 'unauthorized', error: 'Invalid token'});
        }
        res.status(401).json({code: 'unauthorized', error: error});
    }
};