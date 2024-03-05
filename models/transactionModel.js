const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
    planId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Plan'
    },
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Client'
    },
    advisorId: {
        type:  mongoose.Schema.Types.ObjectId,
        ref: 'Advisor'
    },
    clientName: {
        type: String,
        required: [true, 'Need the client Name :)']
    }
},
{
    collection: "transactions",
    versionKey: false,
    timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);
module.exports = Transaction;