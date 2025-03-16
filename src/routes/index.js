const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const coinController = require('../controllers/coinController');
const taskController = require('../controllers/taskController');

// User routes
router.post('/user/register', userController.registerUser);
router.post('/user/daily-reward', userController.claimDailyReward);

// Coin routes
router.post('/coin/register', coinController.registerCoin);
router.post('/coin/vote', coinController.vote);

// Task routes
router.post('/task/complete', taskController.completeTask);

module.exports = router; 