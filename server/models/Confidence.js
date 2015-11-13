var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    learningObjective: {
        type: String,
        required: true
    },
    learningObjectiveTopic: {
        type: String,
    },
    learningObjectiveName: {
        type: String
    },
    cohortId: {
        type: String,
        required: true 
    },
    classId: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    confidence: {
        type: Number,
        required: true
    },
    timestamp: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Confidence', schema);