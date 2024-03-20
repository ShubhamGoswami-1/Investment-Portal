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
    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });
    const plans = await Plan.find({ advisorId: advisor._id });

    const plansWithRandomValues = plans.map(plan => {
        const planWithRandomValues = plan.toObject(); // Convert Mongoose document to plain JavaScript object
        planWithRandomValues.stocks = plan.stocks.map(stock => {
            const randomMultiplier = (Math.random() * (0.05 + 0.03) - 0.03) * 100;
            const currentDayValue = randomMultiplier.toFixed(2); // Limiting to 2 decimal places
            return {
                ...stock.toObject(), // Convert Mongoose document to plain JavaScript object
                currentDayValue
            };
        });
        return planWithRandomValues;
    });

    res.status(200).json({
        status: 'success',
        plans: plansWithRandomValues
    });
});


exports.topPlans = asyncErrorHandler(async (req, res, next) => {
    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });
    const plans = await Plan
    .find({ advisorId: advisor._id, noOfSubscription: { $ne: 0 } })
    .sort({ noOfSubscription: -1 })
    .limit(5);

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

// 1. cummalative return for all transactions (Profit means +ve/-ve)
//  --- First need to find the profit of each plan (Profit means +ve/-ve)
//  -----  First need to find the profit of each stock in a plan (Profit means +ve/-ve)

exports.cummulativeCurrentProfit = asyncErrorHandler(async (req, res, next) => {
    const advisor = await Advisor.findOne({ userIdCredentials: req.user._id });

    const transactions = await Transaction.find({ advisorId: advisor._id });

    let totalCumulativeProfit = 0;
    let totalInvestedAmount = 0;

    transactions.forEach(transaction => {
        let totalProfit = 0; // Initialize total profit for each transaction separately
        totalInvestedAmount += transaction.investedAmount;
        transaction.planStats.forEach(stat => {
            // Generate a random value between -0.03 and 0.05
            const randomMultiplier = Math.random() * (0.05 + 0.03) - 0.03;
            const profitForStat = stat.contriAmount * randomMultiplier;
            console.log(`${stat.contriAmount} : `, randomMultiplier, "Profit: ", profitForStat);

            totalProfit += profitForStat; // Calculate profit for each stat
        });

        console.log("*********************************")
        const cumulativeProfit = transaction.investedAmount + totalProfit;
        console.log("Profit from this plan: ", totalProfit)
        console.log("Initial Invested Amount in this plan: ", transaction.investedAmount)
        console.log("Return from this plan: ", cumulativeProfit)
        console.log();
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log()
        totalCumulativeProfit += cumulativeProfit;
    });

    res.status(200).json({
        status: 'success',
        totalInvestedAmount,
        totalCumulativeReturn: totalCumulativeProfit,
        totalCumulativeProfit: totalCumulativeProfit - totalInvestedAmount
    });
});

exports.deletePlan = asyncErrorHandler(async (req, res, next) => {
    const planId = req.params.planId;
    const plan = await Plan.findByIdAndUpdate(planId, {
        isActive : false
    }, { new: true });

    res.status(200).json({
        status: 'success',
        message: "Plan Deleted !!! :) ",
        plan
    });
})
