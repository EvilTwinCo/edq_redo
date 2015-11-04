var Attendance = require('../models/Attendance');

module.exports = {
    postAttendance: function(socket, data) {
        Attendance.create(data, function(err, createAttendee) {
            .exec(function(err, result) {
              if (err) {
                console.log(err);
              }
              socket.emit('postAttendance', result);
              console.log(result);
            });
          },
          getAttendance: function(socket, data) {
            Attendance.find({})
              .exec(function(err, result) {
                if (err) {
                  console.log(err);
                }
                socket.emit('getAttendance', result);
                console.log(result);
              });
          }
        };
