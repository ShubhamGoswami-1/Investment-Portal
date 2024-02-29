const express = require("express");

const authController = require('./../controllers/authcontroller');
const advisorController = require('./../controllers/advisorController');

const router = express.Router();

router.post('/register-advisor', authController.protect, authController.restrictTo('advisor'), advisorController.register);
router.post('/add-plans', authController.protect, authController.restrictTo('advisor'), advisorController.addPlan);
router.get('/list-of-plans', authController.protect, authController.restrictTo('advisor'), advisorController.listOfPlans);

module.exports = router;