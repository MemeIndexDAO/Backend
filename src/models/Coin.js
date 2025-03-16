const mongoose = require('mongoose');

const coinSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    totalVotes: { type: Number, default: 0 },
    registeredBy: { type: String, required: true }, // Telegram ID
    registeredAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Coin', coinSchema); 