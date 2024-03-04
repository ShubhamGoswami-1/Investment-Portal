const mongoose = require("mongoose");

const plansSchema = new mongoose.Schema({
    capValue: {
        type: String,
        required: [true, 'Enter the cap value']
    },
    maxVal: {
        type: String,
        required: [true, 'Enter the max- value']
    },
    returnProfit: {
        type: String,
        required: [true, 'Enter the return profit']
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
    noOfSubscription: {
        type: Number,
        default: 0
    }
}, {
    collection: "plans",
    versionKey: false,
    timestamps: true
});

const Plan = mongoose.model('Plan', plansSchema);
module.exports = Plan;