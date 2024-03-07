const mongoose = require("mongoose");

const advisorCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        enum: ['standard', 'premium', 'executive']
    },
    subscriptionCharges: {
        type: Map,
        of: Number
    }
}, {
    collection: "advisorCategory",
    versionKey: false,
    timestamps: true
});

const advisorCategory = mongoose.model('advisorCategory', advisorCategorySchema);

module.exports = advisorCategory;