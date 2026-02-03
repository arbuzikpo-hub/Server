const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');

router.get('/csv', exportController.exportCsv);
router.get('/pdf', exportController.exportPdf);

module.exports = router;