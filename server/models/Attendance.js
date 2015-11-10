var mongoose = require('mongoose');

var attendancesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId
    // required: true
  },
  cohort: {
    type: String
    // required: true
  },

  attendanceData: {

    timeIn: {
      type: Date
    },
    timeOut: {
      type: Date
    },
    score: {
      type: Number
    }
    // day:
  }

});

module.exports = mongoose.model('Attendances', attendancesSchema);
