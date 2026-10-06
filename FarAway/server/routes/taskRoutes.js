const express = require('express');
const mongoose = require('mongoose');
const taskController = require('../controller/taskController');

const router = express.Router();

router.route('/').post(taskController.createTask).get(taskController.getTask);
router.route('/:id').get(taskController.getTaskById).patch(taskController.updateTask).delete(taskController.deleteTask);

module.exports = router;
