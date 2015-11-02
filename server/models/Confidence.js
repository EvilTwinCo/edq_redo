var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  response: { type: Number, required: true },
  // user: { type: mongoose.Schema.ObjectID, ref: 'User', required: true },
  // learningObjective: { type: mongoose.Schema.ObjectID, ref: 'LearningObjective', required: true }
});


module.exports = mongoose.model('Confidence', schema);
