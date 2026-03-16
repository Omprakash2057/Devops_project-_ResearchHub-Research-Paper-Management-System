const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadProfile } = require('../middleware/multer');

router.get('/', isAuthenticated, profileController.getProfile);
router.post('/update', isAuthenticated, uploadProfile.single('profilePicture'), profileController.updateProfile);
router.post('/change-password', isAuthenticated, profileController.changePassword);

module.exports = router;
