const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Enter the name!!!']
    },
    email: {
        type: String,
        required: [true, 'Email is required for advisor']
    },
    userIdCredentials: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    advisorIds: {
        type: [String]
    },
    planIds: {
        type: [String]
    }
},  {
    collection: "clients",
    versionKey: false,
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;