const User = require('../models/User');
const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
    try {
        const { title, description, rewardVotes, isDaily, type, actionUrl } = req.body;

        // Validate required fields
        if (!title || !description || !type) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Create new task
        const task = new Task({
            title,
            description,
            rewardVotes: rewardVotes || 0,
            isDaily: isDaily || false,
            type,
            actionUrl: actionUrl || ''
        });

        await task.save();
        res.status(201).json({ message: 'Task created successfully', task });
    } catch (error) {
        console.error('Error creating task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get all tasks for a user
exports.getUserTasks = async (req, res) => {
    try {
        const { telegramId } = req.params;
        
        // Find user
        const user = await User.findOne({ telegramId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Get all tasks
        const tasks = await Task.find();
        
        // Map tasks to include completion status
        const tasksWithStatus = tasks.map(task => {
            const isCompleted = user.completedTasks.some(
                completedTask => completedTask.taskId.toString() === task._id.toString() &&
                (!task.isDaily || 
                 (completedTask.completedAt && 
                  new Date(completedTask.completedAt).toDateString() === new Date().toDateString()))
            );
            
            return {
                id: task._id,
                title: task.title,
                description: task.description,
                rewardVotes: task.rewardVotes,
                isDaily: task.isDaily,
                type: task.type,
                actionUrl: task.actionUrl,
                completed: isCompleted
            };
        });
        
        res.json({ tasks: tasksWithStatus });
    } catch (error) {
        console.error('Error getting user tasks:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Complete a task
exports.completeTask = async (req, res) => {
    try {
        const { userId, taskId } = req.body;
        
        // Find user
        const user = await User.findOne({ telegramId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find task
        const task = await Task.findById(taskId);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Check if task is already completed
        const isAlreadyCompleted = user.completedTasks.some(
            completedTask => completedTask.taskId.toString() === taskId &&
            (!task.isDaily || 
             (completedTask.completedAt && 
              new Date(completedTask.completedAt).toDateString() === new Date().toDateString()))
        );
        
        if (isAlreadyCompleted) {
            return res.status(400).json({ message: 'Task already completed' });
        }
        
        // Add task to completed tasks
        user.completedTasks.push({
            taskId: taskId,
            completedAt: new Date()
        });
        
        // Add reward votes
        user.votesBalance += task.rewardVotes;
        
        // Save user
        await user.save();
        
        res.json({
            message: 'Task completed',
            rewardVotes: task.rewardVotes,
            newBalance: user.votesBalance
        });
    } catch (error) {
        console.error('Error completing task:', error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Verify task completion (for external verification)
exports.verifyTaskCompletion = async (req, res) => {
    try {
        const { userId, taskType } = req.body;
        
        // Find user
        const user = await User.findOne({ telegramId: userId });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        
        // Find task by type
        const task = await Task.findOne({ type: taskType });
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        
        // Check if task is already completed
        const isAlreadyCompleted = user.completedTasks.some(
            completedTask => completedTask.taskId.toString() === task._id.toString() &&
            (!task.isDaily || 
             (completedTask.completedAt && 
              new Date(completedTask.completedAt).toDateString() === new Date().toDateString()))
        );
        
        if (isAlreadyCompleted) {
            return res.status(400).json({ message: 'Task already completed' });
        }
        
        // Add task to completed tasks
        user.completedTasks.push({
            taskId: task._id,
            completedAt: new Date()
        });
        
        // Add reward votes
        user.votesBalance += task.rewardVotes;
        
        // Save user
        await user.save();
        
        res.json({
            message: 'Task completed',
            rewardVotes: task.rewardVotes,
            newBalance: user.votesBalance
        });
    } catch (error) {
        console.error('Error verifying task completion:', error);
        res.status(500).json({ message: 'Server error' });
    }
}; 