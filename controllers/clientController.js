const mongoose = require('mongoose');

const Client = require("../models/clientModel");
const Advisor = require("../models/advisorModel");
const Plan = require("../models/plansModel");
const Transaction = require("../models/transactionModel");

const asyncErrorHandler = require("../utils/asyncErrorHandler");

exports.register = asyncErrorHandler(async (req, res, next) => {

    const clientObj = {
        name: req.user.name,
        email: req.user.email,
        userIdCredentials: req.user._id
    };

    const client = await Client.create({...clientObj});

    res.status(201).json({
        status: 'success',
        client
    });
})

exports.listOfAllAdvisors = asyncErrorHandler(async (req, res, next) => {
    const listOfNamesOfAdvisors = await Advisor.find();
    
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

exports.buyAPlan = asyncErrorHandler( async(req, res, next) => {
    const planId = req.params.planId;
    const advisorId = req.params.advisorId;
    const transaction = await Transaction.create({
        planId,
        advisorId,
        clientId : req.user._id,
        clientName: req.user.name
    });

    const advisor = await Advisor.findById(advisorId);
    const plan = await Plan.findById(planId);
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    if(!advisor.clientIds){
        advisor.clientIds = [];
        advisor.clientIds.push(client._id.toString());
        await advisor.save()
    } else {
        advisor.clientIds.push(client._id.toString());
        await advisor.save();
    }

    if(!client.advisorIds){
        client.advisorIds = [];
        client.planIds = [];
        client.advisorIds.push(advisor._id.toString());
        client.planIds.push(plan._id.toString());
        await client.save();
    } else {
        client.advisorIds.push(advisor._id.toString());
        client.planIds.push(plan._id.toString());
        await client.save();
    }

    plan.noOfSubscription += 1;
    await plan.save();
    
    res.status(201).json({
        status: 'success',
        transaction
    });
})

exports.listOfAdvisors = asyncErrorHandler(async (req, res, next) => {
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    const advisorObjectIds = client.advisorIds.map(id => new mongoose.Types.ObjectId(id));

    const advisors = await Advisor.find({ _id: { $in: advisorObjectIds } });

    res.status(200).json({
        status: 'success',
        advisors
    });
})