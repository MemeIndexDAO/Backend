const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const coinController = require('../controllers/coinController');
const taskController = require('../controllers/taskController');
const referralController = require('../controllers/referralController');

// User routes
router.post('/user/register', userController.registerUser);
router.post('/user/daily-reward', userController.claimDailyReward);
router.get('/user/registered-users', userController.getRegisteredUsers);
router.get('/user/is-registered/:address', userController.isRegistered);
router.get('/user/getmessageid', userController.getPrePreparedMessageId);
// Coin routes
router.post('/coin/register', coinController.registerCoin);
router.post('/coin/vote', coinController.vote);

// Task routes
router.post('/task/complete', taskController.completeTask);

// Referral routes
router.post('/referral/apply', referralController.applyReferralCode);
router.get('/referral/stats/:address', referralController.getReferralStats);
router.get('/referral/leaderboard', referralController.getReferralLeaderboard);
router.get('/referral/referred-users/:address', referralController.getReferredUsers);
router.get('/referral/link/:address', referralController.getReferralLink);

module.exports = router; 