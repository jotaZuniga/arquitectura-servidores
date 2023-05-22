require('dotenv').config();
const User = require('../Models/user.model');
const Utils = require('../config/constants.config');
const jwt = require('jsonwebtoken');
const { v4: uuidv4, validate: uuidValidate } = require('uuid');

module.exports = {
    addUser: (req, res, next) => {
        const { name, email, password, bio} = req.body;
        User.create({
            name: name,
            email: email,
            password: password,
            bio: bio,
        }).then(user => {
            user.activationId = uuidv4();
            user.save();
            return res.status(201).json(user);
        }).catch(next);
    },
    login: (req, res, next) => {
        const {email, password} = req.body;

        if (email && password) {
            const isEmailValid = Utils.emailPattern.test(email);
            const isPasswordValid = Utils.passwordPattern.test(password);
            
            if (isEmailValid && isPasswordValid) {
                User.findOne({email: email, active: true}).then(async user => {
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
                        return res.status(401).json({code: "unauthorized", errors: 'User not found'});
                    }
                }).catch(next);
            } else {
                return res.status(400).json({code: "bad_request", errors: 'Email or Password format invalid'});
            }
        } else {
            return res.status(400).json({ code: "bad_request", errors: 'Email or password required' });
        }
    },
    validate: (req, res, next) => {
        const { id } = req.params;

        if (id && uuidValidate(id)) {
            User.findOne({ activationId: id}).then(user => {
                if (user) {
                    user.active = true;
                    user.activationId = uuidv4();   // re-generate a new id to avoid activation using same URL sent on an email
                    user.save().then(user => {
                        return res.status(200).json({ code: "user_activated", user: { name: user.name, email: user.email } });
                    }).catch(next);
                } else {
                    return res.status(401).json({code: "unauthorized", errors: 'User not found'});
                }
            }).catch(next);
        }else {
            return res.status(400).json({ code: "bad_request", errors: 'activation code required..' });
        }
    }
};