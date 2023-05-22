const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller');
const employeeController = require('../controllers/employee.controller');
const userController = require('../controllers/user.controller');
const appAuth = require('../middleware/secure.middleware');

// Users
router.post('/users', userController.addUser);
router.post('/login', userController.login);
router.get('/user/:id/activate', userController.validate);

// Employees
router.get('/employees', appAuth.auth, employeeController.list);
router.get('/oldest', appAuth.auth, employeeController.oldest);
router.post('/employees', appAuth.auth, employeeController.userValidator, userController.addUser);
router.get('/employees/:name', appAuth.auth, employeeController.userName);

// Posts
router.post('/posts', appAuth.auth, postController.add);
router.get('/posts', appAuth.auth, postController.list);
router.get('/posts/:id', appAuth.auth, postController.info);
router.patch('/posts/:id', appAuth.auth, postController.update);
router.delete('/posts/:id', appAuth.auth, postController.delete)

module.exports = router;