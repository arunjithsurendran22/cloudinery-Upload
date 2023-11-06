const express = require('express');
const router = express.Router();
const mediaController = require('../controllers/mediaController');
const upload = require('../middleware/multer');

router.get('/', mediaController.showMedia);
router.post('/upload', upload.array('media'), mediaController.uploadMedia);
router.post('/delete/:id', mediaController.deleteMedia);

module.exports = router;
