const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
    item: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    packed: {
        type: Boolean,
        required: true,
        default: false
    },
    idx: {
        type: Date,
        default: Date.now()
    }
})

const Task = mongoose.model('Task', TaskSchema);

module.exports = Task;