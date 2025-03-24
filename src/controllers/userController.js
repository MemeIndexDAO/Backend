const User = require('../models/User');

const REFERRAL_REWARD = 5; 
const REFEREE_REWARD = 2; 

exports.getRegisteredUsers = async (req, res) => {
    try {
        const users = await User.find();    
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.isRegistered = async (req, res) => {
    try {
        const address = req.params.address;
        const user = await User.findOne({ address });
        res.status(200).json({ isRegistered: !!user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.registerUser = async (req, res) => {
    try {
        const { address, username, referralCode, prePreparedMessageId } = req.body;
        
        let user = await User.findOne({ address });
        if (user) {
            return res.status(200).json({
                message: 'User already exists',
                user: {
                    address: user.address,
                    username: user.username,
                    referralCode: user.referralCode,
                    votesBalance: user.votesBalance
                }
            });
        }

        user = new User({ address, username, prePreparedMessageId });
        await user.save();

        // Handle referral if code provided
        if (referralCode) {
            const referrer = await User.findOne({ referralCode });
            if (referrer && referrer.address !== address) {
                user.referredBy = referrer.address;
                user.votesBalance += REFEREE_REWARD;
                
                referrer.referralCount += 1;
                referrer.votesBalance += REFERRAL_REWARD;
                referrer.referralRewardsEarned += REFERRAL_REWARD;
                
                await Promise.all([user.save(), referrer.save()]);
            }
        }

        res.status(201).json({
            message: 'User registered successfully',
            user: {
                address: user.address,
                username: user.username,
                referralCode: user.referralCode,
                votesBalance: user.votesBalance
            }
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.claimDailyReward = async (req, res) => {
    try {
        const { address } = req.body;
        const user = await User.findOne({ address });

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