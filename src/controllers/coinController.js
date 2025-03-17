const Coin = require('../models/Coin');
const Vote = require('../models/Vote');
const User = require('../models/User');

exports.registerCoin = async (req, res) => {
    try {
        const { address, name, symbol, registeredBy } = req.body;
        
        let coin = await Coin.findOne({ address });
        if (coin) {
            return res.status(400).json({ message: 'Coin already registered' });
        }

        coin = new Coin({ address, name, symbol, registeredBy });
        await coin.save();

        res.status(201).json({ message: 'Coin registered successfully', coin });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.vote = async (req, res) => {
    try {
        const { userAddress, coinAddress, amount } = req.body;
        
        const user = await User.findOne({ address: userAddress });
        if (!user || user.votesBalance < amount) {
            return res.status(400).json({ message: 'Insufficient votes' });
        }

        const coin = await Coin.findOne({ address: coinAddress });
        if (!coin) {
            return res.status(404).json({ message: 'Coin not found' });
        }

        const vote = new Vote({ 
            userId: userAddress, // Using TON address instead of telegramId
            coinAddress, 
            amount 
        });
        await vote.save();

        user.votesBalance -= amount;
        coin.totalVotes += amount;

        await user.save();
        await coin.save();

        res.json({ message: 'Vote recorded successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 