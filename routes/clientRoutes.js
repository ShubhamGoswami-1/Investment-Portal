const express = require("express");

const router = express.Router();

const authController = require("./../controllers/authcontroller");
const clientController = require("../controllers/clientController");

router.post('/register-client', authController.protect, authController.restrictTo('client'), clientController.register)
router.get('/get-all-advisors', authController.protect, authController.restrictTo('client'), clientController.listOfAllAdvisors);
router.get('/list-of-plans/:advisorId', authController.protect, authController.restrictTo('client'), clientController.listOfPlans)
router.post('/buyPlan/advisor/:advisorId/plan/:planId', authController.protect, authController.restrictTo('client'), clientController.buyAPlan);
router.get('/getAdvisors', authController.protect, authController.restrictTo('client'), clientController.listOfAdvisors);
router.get('/get-subscribed-plans', authController.protect, authController.restrictTo('client'), clientController.listOfSubscribedPlans);
router.get('/get-returns-of-subscribed-plans', authController.protect, authController.restrictTo('client'), clientController.listOfSubscribedPlansDetails)
router.get('/get-all-plans', authController.protect, authController.restrictTo('client'), clientController.browseAllPlans);

module.exports = router;