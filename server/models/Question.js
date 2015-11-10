  var mongoose = require('mongoose');

var schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    studentId: {
        type: String
    },
    cohortId: {
        type: String
    },
    mentorName: {
        type: String
    },
    imageUrl: {
        type: String
    },
    question: {
        type: String,
        required: true
    },
    directive: {
        type: String,
        required: true
    },
    timeWhenEntered: {
        type: Date,
        required: true
    },
    timeMentorBegins: {
        type: Date
    },
    timeQuestionAnswered: {
        type: Date
    },
    studentSolution: {
        type: String
    },
    mentorSolution: {
        type: String
    },
    questionCategory: {
        type: String
    }
});

module.exports = mongoose.model('Question', schema);