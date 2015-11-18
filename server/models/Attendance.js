var mongoose = require('mongoose');

var attendancesSchema = new mongoose.Schema({

    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
    cohortId: {type: String},
    attendanceData: {
        timeIn: {type: Date},
        timeOut: {type: Date},
        score: {type: Number},
        dateOfAttendance: {type: Date}
    }
    
});

module.exports = mongoose.model('Attendances', attendancesSchema);