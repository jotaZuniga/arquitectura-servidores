const express = require('express');
const router = express.Router();

const userController = require('../controllers/users.controller');

router.get('/employees', userController.list);

router.get('/oldest', userController.oldest);

router.post('/employees', userController.userValidator, userController.addUser);

router.get('/employees/:name', userController.userName);

module.exports = router;