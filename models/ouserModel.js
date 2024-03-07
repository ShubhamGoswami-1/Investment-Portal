const mongoose = require('mongoose');

const ouserSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String
});

const OUser = mongoose.model('OUser', ouserSchema);

module.exports = OUser;