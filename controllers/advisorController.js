const Advisor = require("./../models/advisorModel");
const Plan = require('./../models/plansModel');

const asyncErrorHandler = require('./../utils/asyncErrorHandler');

exports.register = asyncErrorHandler(async (req, res, next) => {

    const advisorObj = {...req.body};
    advisorObj.userIdCredentials = req.user._id;
    advisorObj.email = req.user.email;
    advisorObj.name = req.user.name;
    
    const advisor = await Advisor.create({...advisorObj});

    res.status(201).json({
        status: 'success',
        data: {
            advisor
        }
    });
});

exports.addPlan = asyncErrorHandler(async (req, res, next) => {
    const planObj = {...req.body};
    const advisorId = await Advisor.findOne({userIdCredentials: req.user._id});
    planObj.advisorId = advisorId._id;

    const plan = await Plan.create({...planObj});

    res.status(201).json({
        status: 'success',
        data: {
            plan
        }
    });
});

exports.listOfPlans = asyncErrorHandler(async (req, res, next) => {

    const advisor = await Advisor.findOne({userIdCredentials: req.user._id});

    const plans = await Plan.find({advisorId: advisor._id});

    res.status(200).json({
        status: 'success',
        plans
    });
})