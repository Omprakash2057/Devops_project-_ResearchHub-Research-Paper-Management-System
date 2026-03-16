const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const { isAuthenticated } = require('../middleware/auth');
const { uploadPDF } = require('../middleware/multer');

router.get('/', isAuthenticated, paperController.index);
router.get('/create', isAuthenticated, paperController.getCreate);
router.post('/create', isAuthenticated, uploadPDF.single('pdfFile'), paperController.postCreate);
router.get('/:id', isAuthenticated, paperController.show);
router.get('/:id/edit', isAuthenticated, paperController.getEdit);
router.put('/:id', isAuthenticated, paperController.putEdit);
router.delete('/:id', isAuthenticated, paperController.delete);

module.exports = router;
