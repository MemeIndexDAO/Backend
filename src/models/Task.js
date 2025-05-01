const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    rewardVotes: {
        type: Number,
        required: true,
        default: 0
    },
    isDaily: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
        required: true,
        enum: ['invite_friends', 'join_bot', 'join_group', 'custom'],
    },
    actionUrl: {
        type: String,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Task', taskSchema); 