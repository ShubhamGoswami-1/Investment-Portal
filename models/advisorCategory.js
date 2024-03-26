const mongoose = require("mongoose");

const advisorCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['standard', 'premium', 'executive']
    },
    subscriptionCharges: {
        type: Map,
        of: Number
    },
    category: {
        type: String,
        enum: ['Standard', 'Executive', 'Premium'],
        default: 'Standard'
    }
}, {
    collection: "advisorCategory",
    versionKey: false,
    timestamps: true
});

const advisorCategory = mongoose.model('advisorCategory', advisorCategorySchema);

module.exports = advisorCategory;