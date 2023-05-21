const { check, validationResult } = require('express-validator');
const employeesAPI = require('../API/api.json');

module.exports = {
    userValidator: [
        check('name').notEmpty(),
        check('age').isNumeric(),
        check('phone.personal').isString(),
        check('favorites.artist').isString(),
        check('favorites.food').isString(),
        check('privileges').isString(),
        check('finished').isArray(),
        check('badges').isArray(),
        check('points').isArray(),        
    ],
    list: (req, res, next) => {
        if(Object.keys(req.query).length === 0) {
            return res.status(200).send(employeesAPI);
        }
    
        const {pages, user, badges} = req.query;
    
        // Query: pages
        if (pages && check(pages).notEmpty()) {
            const castPage = parseInt(pages,10);
    
            if (!isNaN(castPage) ) {
                const start =  (2 * (castPage - 1));
                const end = (2 * (castPage - 1)) + 2;
                const filtered = employeesAPI.slice(start, end);
    
                if (!filtered.length) {
                    return res.status(200).json({code: 'limit_exceed'});
                }
    
                return res.status(200).json(filtered);
            } else {
                return res.status(400).send('Invalid query');
            }
        }
    
        // Query: user
        if(user && check(user).notEmpty().isBoolean()) {
            if (user.toLowerCase() === 'true') {
                const roleUserList = employeesAPI.filter(item => item.privileges === 'user');
                return res.status(200).json(roleUserList);
            } else {
                return res.status(400).json({code: 'invalid_value'});
            }
        }
    
        //Query: badges
        if(badges && check(badges).notEmpty().isString()) {
            const castValue = parseInt(badges);
    
            if (!isNaN(castValue) ) {
                return res.status(400).json({code: 'invalid_value'});
            }
    
            const blackItems = employeesAPI.filter(item => item.badges.includes(badges));
            return res.status(200).json(blackItems);
        }
    
    
        return res.status(400).send('Invalid query. Info not provided correctly.');
    },
    oldest: (req, res, next) => {
        const oldestItem = employeesAPI.reduce((previous, current) => {
            return previous.age > current.age ? previous : current;
        });
        return res.status(200).json(oldestItem);
    },    
    addUser: (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({ code: "bad_request", errors: errors.array() });
        }
    
        employeesAPI.push(req.body);
        res.status(200).json({message: 'User created', user: employeesAPI.at(-1)});
    },
    userName: (req, res, next) => {
        if (req.params.name) {
            const filterData = employeesAPI.find(item => item.name.toLowerCase() === req.params.name.toLowerCase());
    
            if (!filterData) {
                return res.status(404).json({code: 'not_found'});
            }
    
            return res.status(200).json(filterData);
        }
    
        return res.status(400).send('Invalid Parameter');
    },
};