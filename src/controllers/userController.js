const User = require('../models/User');

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