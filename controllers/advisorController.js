const mongoose = require("mongoose");

const Advisor = require("./../models/advisorModel");
const Client = require("./../models/clientModel");
const Plan = require('./../models/plansModel');
const Transaction = require("./../models/transactionModel");

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
    
    // res.redirect('/api/v1/check-auth/welcome-advisor');
});

exports.listOfPlans = asyncErrorHandler(async (req, res, next) => {

    const advisor = await Advisor.findOne({userIdCredentials: req.user._id});

    const plans = await Plan.find({advisorId: advisor._id});

    res.status(200).json({
        status: 'success',
        plans
    });
})

exports.topPlans = asyncErrorHandler(async (req, res, next) => {
    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });
    const plans = await Plan.find({ advisorId: advisor._id }).sort({ nuOfSubscription: -1 });

    res.status(200).json({
        status: 'success',
        plans
    });
});

exports.listOfClients = asyncErrorHandler(async(req, res, next) => {
    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });

    const clientObjectIds = advisor.clientIds.map(id => new mongoose.Types.ObjectId(id));

    const clients = await Client.find({ _id: { $in: clientObjectIds }});

    res.status(200).json({
        status: 'success',
        clients
    });
});

exports.getOwndetails = asyncErrorHandler(async (req, res, next) => {
    const advisor = await Advisor.findOne({userIdCredentials: req.user._id});

    res.status(200).json({
        status: 'success',
        advisor
    });
}) 

exports.getTransactions = asyncErrorHandler(async (req, res, next) => {
    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });

    const transactions = await Transaction.find({ advisorId: advisor._id });

    res.status(200).json({
        status: 'success',
        transactions
    });
})

exports.getNoOfClients = asyncErrorHandler(async (req, res, next) => {

    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });

    res.status(200).json({
        status: 'success',
        noOfClients: advisor.clientIds.length
    });
})

exports.totalCummulativeInvestedAmounts = asyncErrorHandler(async (req, res, next) => {
    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });

    const transactions = await Transaction.find({ advisorId: advisor._id });

    const totalInvestedAmount = transactions.reduce((total, trsc) => total + trsc.investedAmount, 0);

    res.status(200).json({
        status: 'success',
        totalInvestedAmount
    });
})

// 1. cummalative return for all clients of a particular advisor

