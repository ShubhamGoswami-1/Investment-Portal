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
  
    const plan = await Plan.findById(planId);
    const client = await Client.findOne({ userIdCredentials: req.user._id });
    const advisor = await Advisor.findById(advisorId);

    const planStatsObj = plan.stocks.map(stock => ({
        stockName: stock.stockName,
        contriAmount: (stock.contri / 100) * req.body.investedAmount
    }));

    const transaction = await Transaction.create({
        planId,
        advisorId,
        clientId : client._id,
        clientName: client.name,
        investedAmount: req.body.investedAmount,
        planStats: planStatsObj
    });

    if(!advisor.clientIds){
        advisor.clientIds = [];
        advisor.clientIds.push(client._id.toString());
        await advisor.save()
    } else {
        if (!advisor.clientIds.includes(client._id.toString())) {
            advisor.clientIds.push(client._id.toString());
            await advisor.save();
        }
    }

    if(!client.advisorIds){
        client.advisorIds = [];
        client.planIds = [];
        client.advisorIds.push(advisor._id.toString());
        client.planIds.push(plan._id.toString());
        await client.save();
    } else {
        if (!client.advisorIds.includes(advisor._id.toString())){
            client.advisorIds.push(advisor._id.toString());
        }
        if(!client.planIds.includes(plan._id.toString())){
            client.planIds.push(plan._id.toString());
        }
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

exports.listOfSubscribedPlans = asyncErrorHandler(async (req, res, next) => {
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    const transactions = await Transaction.find({ clientId: client._id });

    res.status(200).json({
        status: 'success',
        transactions
    });
})

exports.listOfSubscribedPlansDetails = asyncErrorHandler( async(req, res, next) => {
    const client = await Client.findOne({ userIdCredentials: req.user._id });

    const transactions = await Transaction.find({ clientId: client._id });

    let totalCumulativeProfit = 0;
    let profits = [];

    transactions.forEach(transaction => {
        let totalProfit = 0; // Initialize total profit for each transaction separately

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
        profitElement = {
            planId: transaction.planId,
            profit: totalProfit
        }
        profits.push(profitElement);
    });

    res.status(200).json({
        status: 'success',
        profits
    });
})