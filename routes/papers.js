// Papers routes
const express = require('express');
const router = express.Router();
const paperController = require('../controllers/paperController');
const upload = require('../middleware/multer');

router.get('/', paperController.list);
router.post('/', upload.single('paper'), paperController.store);
router.get('/create', paperController.create);
router.get('/:id', paperController.show);
router.get('/:id/edit', paperController.edit);

module.exports = router;
