const express = require('express');
const router = express.Router();

const postController = require('../controllers/post.controller');
const userController = require('../controllers/users.controller');

// Employees
router.get('/employees', userController.list);
router.get('/oldest', userController.oldest);
router.post('/employees', userController.userValidator, userController.addUser);
router.get('/employees/:name', userController.userName);

// Posts
router.post('/posts', postController.add);
router.get('/posts', postController.list);
router.get('/posts/:id', postController.info);
router.patch('/posts/:id', postController.update);
router.delete('/posts/:id', postController.delete)

module.exports = router;