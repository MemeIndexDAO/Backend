const mongoose = require('mongoose');

const voteSchema = new mongoose.Schema({
    userTelegramId: { type: String, required: true }, // User telegramId
    coinAddress: { type: String, required: true },
    amount: { type: Number, required: true },
});

module.exports = mongoose.model('Vote', voteSchema); 