require('dotenv').config();
const User = require('../Models/user.model');
const Utils = require('../config/constants.config');
const jwt = require('jsonwebtoken');

module.exports = {
    addUser: (req, res, next) => {
        const data = { name, email, password, bio} = req.body;
        User.create({...data}).then(user => {
            return res.status(201).json(user);
        }).catch(next);
    },
    login: (req, res, next) => {
        const {email, password} = req.body;

        if (email && password) {
            const isEmailValid = Utils.emailPattern.test(email);
            const isPasswordValid = Utils.passwordPattern.test(password);
            
            if (isEmailValid && isPasswordValid) {
                User.findOne({email: email}).then(async user => {
                    if (user) {
                        user.checkPassword(password).then(match => {
                            if (match) {
                                const token = jwt.sign({sub: user.id}, process.env.JWT_KEY || 'secret key', { expiresIn: 120000});
                                return res.status(200).json({token});
                            }else {
                                return res.status(401).json({code: "unauthorized", error: 'Invalid credentials'});
                            }
                        }).catch(next);
                    } else {
                        return res.status(401).json({code: "unauthorized", errors: 'Email not found'});
                    }
                }).catch(next);
            } else {
                return res.status(400).json({code: "bad_request", errors: 'Email or Password format invalid'});
            }
        } else {
            return res.status(400).json({ code: "bad_request", errors: 'Email or password required' });
        }
    }
};