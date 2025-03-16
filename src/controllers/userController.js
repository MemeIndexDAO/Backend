const User = require('../models/User');

exports.registerUser = async (req, res) => {
    try {
        const { address, username } = req.body;
        
        let user = await User.findOne({ address });
        if (user) {
            return res.status(400).json({ message: 'User already registered' });
        }

        user = new User({ address, username });
        await user.save();

        res.status(201).json({ message: 'User registered successfully', user });
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