const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    address: { type: String, required: true, unique: true }, // TON wallet address
    username: { type: String, required: true },
    votesBalance: { type: Number, default: 0 },
    lastDailyReward: { type: Date },
    referralCode: { type: String, unique: true },
    referredBy: { type: String }, // This will store referrer's TON address
    referralCount: { type: Number, default: 0 },
    referralRewardsEarned: { type: Number, default: 0 },
    prePreparedMessageId: { type: String,required:true},
    completedTasks: [{
        taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
        completedAt: { type: Date, default: Date.now }
    }],
    registeredAt: { type: Date, default: Date.now }
});

// Generate unique referral code before saving
userSchema.pre('save', async function(next) {
    if (!this.referralCode) {
        // Generate 8 character unique code
        this.referralCode = Math.random().toString(36).substring(2, 10).toUpperCase();
    }
    next();
});

module.exports = mongoose.model('User', userSchema); 