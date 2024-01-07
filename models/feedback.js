const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
    feedbackCategory: {
        type: String,
        required: true,
    },
    feedbackText: {
        type: String,
        required: true,
    },
    submissionTime: {
        type: Date,
        default: Date.now,
    },
});

const Feedback = mongoose.model('feedbacks', feedbackSchema);

module.exports = Feedback;