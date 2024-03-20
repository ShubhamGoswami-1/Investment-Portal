const mongoose = require("mongoose");
const validator = require("validator");

const keyValueSchema = new mongoose.Schema({
    stockName: String,
    contri: Number
});

const plansSchema = new mongoose.Schema({
    planName: {
        type: String,
        required: [true, 'Need to name a plan!!!']
    },
    capValue: {
        type: Number,
        // Sum of Investment amounts by clients (those who buyied this plan)
    },
    maxVal: {
        type: String,   
        required: [true, 'Enter the max- value']
    },
    returnProfitPercentage: {
        type: String,
    },
    risk: {
            type: String,
            enum: ['low', 'medium', 'high'],
            default: 'medium',
            required: true
    },
    advisorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Advisor'
    },
    minInvestmentAmount: {
        type: Number,
        required: [true, 'Atleast this amount need to be invested!']
    },
    noOfSubscription: {
        type: Number,
        default: 0
    },
    advise: {
        type: String,
        required: [true, 'Add you advise, cause thats ur sale speech']
    },
    stocks: {
        type: [keyValueSchema],
        validate: {
            validator: function(value) {
                // Calculate the total contribution sum
                const totalContribution = value.reduce((acc, curr) => acc + curr.contri, 0);
                // Check if the total contribution is exactly 100
                return totalContribution === 100;
            },
            message: props => `Total contribution should sum up to 100`
        },
        required: [true, 'Stocks need to be added']
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    collection: "plans",
    versionKey: false,
    timestamps: true
});

const Plan = mongoose.model('Plan', plansSchema);
module.exports = Plan;