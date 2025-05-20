const express = require('express');
const router = express.Router();
const planController = require('../controllers/plan.controller');

router.post('/', planController.createPlan);
router.get('/', planController.getAllPlans); // GET para listar todos los planes

module.exports = router;