const User = require('../models/User');

exports.getRegisteredUsers = async (req, res) => {
    try {
        const users = await User.find();    
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUser = async (req, res) => {
    try {
        const telegramId = (req.params.telegramId);
        const user = await User.findOne({ telegramId });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
exports.isRegistered = async (req, res) => {
    try {
        const telegramId = (req.params.telegramId);
        const user = await User.findOne({ telegramId });
        if(user){
            res.status(200).json({ isRegistered: true });
        }else{
            res.status(200).json({ isRegistered: false });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { telegramId, username } = req.body;
        
        let user = await User.findOne({ telegramId });
        if (user) {
            return res.status(200).json({
                message: 'User already exists',
                user: {
                    telegramId: user.telegramId,
                    username: user.username,
                    referralCode: user.referralCode,
                    votesBalance: user.votesBalance,
                }
            });
        }

        user = new User({ 
            telegramId,
            username, 
            referralCode:telegramId, 
        });
        await user.save();

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                telegramId: user.telegramId,
                username: user.username,
                referralCode: user.referralCode,
                votesBalance: user.votesBalance,
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.claimDailyReward = async (req, res) => {
    try {
        const { telegramId } = req.body;
        const user = await User.findOne({ telegramId });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const now = new Date();
        const lastReward = user.lastDailyReward;
        
        if (lastReward && now.getDate() === lastReward.getDate()) {
            return res.status(400).json({ message: 'Daily reward already claimed' });
        }

        user.votesBalance += 1;
        user.lastDailyReward = now;
        await user.save();

        res.json({ message: 'Daily reward claimed', newBalance: user.votesBalance });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update user votes
exports.updateUserVotes = async (req, res) => {
    try {
        const { telegramId, votes } = req.body;
        
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        user.votesBalance += votes;
        await user.save();

        res.json({
            message: 'Votes updated successfully',
            newBalance: user.votesBalance
        });
    } catch (error) {
        console.error('Error updating votes:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Update user referral code
exports.updateUserReferral = async (req, res) => {
    try {
        const { telegramId, referralCode } = req.body;
        
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if referral code is already in use
        const existingUser = await User.findOne({ referralCode });
        if (existingUser) {
            return res.status(400).json({ message: 'Referral code already in use' });
        }

        user.referralCode = referralCode;
        await user.save();

        res.json({
            message: 'Referral code updated successfully',
            referralCode: user.referralCode
        });
    } catch (error) {
        console.error('Error updating referral code:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's referral link
exports.getReferralLink = async (req, res) => {
    try {
        const { telegramId } = req.params;
        
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const referralLink = `https://t.me/your_bot_username?start=${user.referralCode}`;
        res.json({ referralLink });
    } catch (error) {
        console.error('Error getting referral link:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get user's referral statistics
exports.getReferralStats = async (req, res) => {
    try {
        const { telegramId } = req.params;
        
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Get all users who used this user's referral code
        const referredUsers = await User.find({ referredBy: user.referralCode });

        res.json({
            referralCode: user.referralCode,
            totalReferrals: referredUsers.length,
            referralLink: `https://t.me/your_bot_username?start=${user.referralCode}`,
            referredUsers: referredUsers.map(user => ({
                telegramId: user.telegramId,
                username: user.username,
                joinedAt: user.createdAt
            }))
        });
    } catch (error) {
        console.error('Error getting referral stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 