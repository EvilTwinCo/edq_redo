var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cohort: {
    type: String,
    required: true
  },
  timeIn: {
    type: Date
  },
  timeOut: {
    type: Date
  }
});
