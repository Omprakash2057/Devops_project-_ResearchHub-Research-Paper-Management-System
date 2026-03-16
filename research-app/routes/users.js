const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

router.get('/', isAuthenticated, isAdmin, userController.index);
router.get('/:id/edit', isAuthenticated, isAdmin, userController.getEdit);
router.put('/:id', isAuthenticated, isAdmin, userController.putEdit);
router.delete('/:id', isAuthenticated, isAdmin, userController.delete);

module.exports = router;
