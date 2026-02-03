const express = require('express');
const router = express.Router();
const simulationController = require('../controllers/simulationController');

router.post('/run', simulationController.run);
router.get('/flows', simulationController.getFlows);
router.get('/personas', simulationController.getPersonas);

module.exports = router;