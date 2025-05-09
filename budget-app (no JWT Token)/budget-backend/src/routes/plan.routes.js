const express = require('express');
const router = express.Router();
const planController = require('../controllers/plan.controller');

// Crear un plan (puede quedar público o proteger si es necesario)
router.post('/', planController.createPlan);

module.exports = router;
