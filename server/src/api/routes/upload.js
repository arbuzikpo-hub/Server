const express = require('express');
const router = express.Router();
const uploadController = require('../controllers/uploadController');
const multer = require('multer');
const upload = multer({ dest: 'src/data/uploads/' });

router.post('/', upload.array('documents', 4), uploadController.uploadDocuments);

module.exports = router;