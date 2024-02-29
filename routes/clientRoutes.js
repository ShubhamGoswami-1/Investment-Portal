const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");
const clientController = require("./../controllers/clentController");

router.get('/get-all-advisors', authController.protect, authController.restrictTo('client'), clientController.listOfAdvisors);
router.get('/list-of-plans/:advisorId', authController.protect, authController.restrictTo('client'), clientController.listOfPlans)

module.exports = router;