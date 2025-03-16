const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userAddress: { type: String, required: true }, // User address
    coinAddress: { type: String, required: true },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('Vote', voteSchema); 