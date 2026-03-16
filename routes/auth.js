// Auth routes
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.get('/login', authController.login);
router.get('/register', authController.register);
router.get('/logout', authController.logout);

module.exports = router;
