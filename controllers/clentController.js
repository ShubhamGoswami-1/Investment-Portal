const Client = require("./../models/clientModel");
const Advisor = require("./../models/advisorModel");
const Plan = require("./../models/plansModel");

const asyncErrorHandler = require("./../utils/asyncErrorHandler");

exports.listOfAdvisors = asyncErrorHandler(async (req, res, next) => {
    const listOfAdvisors = await Advisor.find();
    const listOfNamesOfAdvisors = listOfAdvisors.map(advisor => advisor.name);
    
    res.status(200).json({
        status: 'success',
        listOfNamesOfAdvisors
    });
});

exports.listOfPlans = asyncErrorHandler(async (req, res, next) => {

    const advisorId = req.params.advisorId;

    const plans = await Plan.find({advisorId});

    res.status(200).json({
        status: 'success',
        plans
    });
})