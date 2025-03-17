const User = require('../models/User');

// Constants for referral rewards
const REFERRAL_REWARD = 5; // Votes for referrer
const REFEREE_REWARD = 2;  // Votes for new user

exports.applyReferralCode = async (req, res) => {
    try {
        const { address, referralCode } = req.body;

        const user = await User.findOne({ address });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.referredBy) {
            return res.status(400).json({ message: 'Referral code already used' });
        }

        const referrer = await User.findOne({ referralCode });
        if (!referrer) {
            return res.status(404).json({ message: 'Invalid referral code' });
        }

        if (referrer.address === user.address) {
            return res.status(400).json({ message: 'Cannot use own referral code' });
        }

        referrer.referralCount += 1;
        referrer.votesBalance += REFERRAL_REWARD;
        referrer.referralRewardsEarned += REFERRAL_REWARD;
        await referrer.save();

        user.referredBy = referrer.address;
        user.votesBalance += REFEREE_REWARD;
        await user.save();

        res.json({
            message: 'Referral code applied successfully',
            rewardEarned: REFEREE_REWARD,
            newBalance: user.votesBalance
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReferralStats = async (req, res) => {
    try {
        const { address } = req.params;

        const user = await User.findOne({ address });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            referralCode: user.referralCode,
            referralCount: user.referralCount,
            rewardsEarned: user.referralRewardsEarned
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getReferralLeaderboard = async (req, res) => {
    try {
        const leaderboard = await User.find()
            .sort({ referralCount: -1 })
            .limit(10)
            .select('username referralCount referralRewardsEarned -_id');

        res.json(leaderboard);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

exports.getReferredUsers = async (req, res) => {
    try {
        const { address } = req.params;

        // Find all users who were referred by this address
        const referredUsers = await User.find({ referredBy: address })
            .select('address username registeredAt -_id')
            .sort({ registeredAt: -1 }); // Most recent first

        res.json({
            count: referredUsers.length,
            referredUsers: referredUsers.map(user => ({
                address: user.address,
                username: user.username,
                joinedAt: user.registeredAt
            }))
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

exports.getReferralLink = async (req, res) => {
    try {
        const { address } = req.params;
        
        const user = await User.findOne({ address });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate bot link with referral code
        const botLink = `https://t.me/${process.env.BOT_USERNAME}?start=${user.referralCode}`;

        res.json({
            referralCode: user.referralCode,
            referralLink: botLink
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 

