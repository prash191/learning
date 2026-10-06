const Task = require("../model/taskmodal");
const mongoose = require('mongoose');
const taskFields = ['item', 'quantity', 'packed'];

exports.createTask = async (req, res) => {
    console.log('coming here')
    try {
		const task = await Task.create(req.body);
		res.status(201).json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

exports.getTask = async (req, res) => {
    console.log('getTask called');
    try {
        const tasks = await Task.find().sort({ idx: 1 });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve tasks' });
    }
}

exports.getTaskById = async (req, res) => {
    if (!mongoose.isValidObjectId(req.params.id)) {
        return res.status(400).json({ message: 'Invalid task ID' });
    }

    try {
        const task = await Task.findById(req.params.id);
        if (!task) {
            return res.status(404).json({ message: 'Task not found' });
        }
        res.json(task);
    } catch (error) {
        res.status(500).json({ message: 'Failed to retrieve task' });
    }
}

exports.updateTask = async (req, res) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		return res.status(400).json({ message: 'Invalid task ID' });
	}

	const updates = Object.fromEntries(
		Object.entries(req.body).filter(([field]) => taskFields.includes(field))
	);
	if (Object.keys(updates).length === 0) {
		return res.status(400).json({ message: 'No valid task fields provided' });
	}

	try {
		const task = await Task.findByIdAndUpdate(req.params.id, updates, {
			new: true,
			runValidators: true
		});
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.json(task);
	} catch (error) {
		res.status(400).json({ message: error.message });
	}
}

exports.deleteTask = async (req, res) => {
	if (!mongoose.isValidObjectId(req.params.id)) {
		return res.status(400).json({ message: 'Invalid task ID' });
	}

	try {
		const task = await Task.findByIdAndDelete(req.params.id);
		if (!task) {
			return res.status(404).json({ message: 'Task not found' });
		}
		res.json({ message: 'Task deleted', task });
	} catch (error) {
		res.status(500).json({ message: 'Failed to delete task' });
	}
}