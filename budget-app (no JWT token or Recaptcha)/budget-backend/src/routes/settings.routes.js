const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settings.controller');

router.get('/hourly-rate', settingsController.getHourlyRate);
router.put('/hourly-rate', settingsController.updateHourlyRate);

module.exports = router;
