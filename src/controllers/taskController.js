const Task = require('../models/Task');
const User = require('../models/User');

exports.completeTask = async (req, res) => {
    try {
        const { userId, taskId } = req.body;
        
        const user = await User.findOne({ telegramId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }

        // Check if task already completed (for daily tasks, check date)
        const completed = user.completedTasks.find(t => 
            t.taskId.equals(taskId) && 
            (!task.isDaily || t.completedAt.getDate() === new Date().getDate())
        );

        if (completed) {
            return res.status(400).json({ message: 'Task already completed' });
        }

        user.completedTasks.push({ taskId });
        user.votesBalance += task.rewardVotes;
        await user.save();

        res.json({ 
            message: 'Task completed', 
            rewardVotes: task.rewardVotes,
            newBalance: user.votesBalance 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}; 