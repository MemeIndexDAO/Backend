const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true },
    username: { type: String },
    votesBalance: { type: Number, default: 10 },
    lastDailyReward: { type: Date,required: false },
});

module.exports = mongoose.model('User', userSchema); 