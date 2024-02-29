const mongoose = require("mongoose");

const clientSchema = new mongoose.Schema({

},  {
    collection: "clients",
    versionKey: false,
    timestamps: true
});

const Client = mongoose.model('Client', clientSchema);
module.exports = Client;