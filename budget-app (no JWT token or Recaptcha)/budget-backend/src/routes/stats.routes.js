const express = require('express');
const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/monthly', statsController.getMonthlyStats);
router.get('/popular-options', statsController.getPopularOptions);

module.exports = router;
