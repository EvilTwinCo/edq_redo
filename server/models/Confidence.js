var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  response: { type: Number, required: true },
  // user: { type: mongoose.Schema.ObjectID, ref: 'User', required: true },
  // learningObj: { type: mongoose.Schema.ObjectID, ref: 'LearningObj', required: true }
});


module.exports = mongoose.model('Confidence', schema);
