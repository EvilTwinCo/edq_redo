var Attendance = require('../models/Attendance');
var mongoose = require('mongoose');
var User = require('../models/User');
var _ = require('underscore');



module.exports = {

  postAttendance: function(socket, data) {

    Attendance.findById(data._id, function(err, attendance) {

      if (attendance) {
        attendance.attendanceData = data.attendanceData;
        attendance.save(function(err) {
          if (err) {
            console.log(err);
          }
          socket.emit('attendanceUpdate', attendance)
        })

      } else {
        new Attendance(data).save(function(error, data) {
          if (error) {
            console.log("OMG! Im on fire!!!", error)
          } else {
            console.log("not on fire")
            socket.emit("attendanceUpdate", data)
          }
        })
      }

    })
  },

  getAttendance: function(socket, data) {
    var today = function(){
      return new Date();
    }
      var morning = today();
      morning.setHours(0,0,0,0);

      User.find({}).exec(function(err, users) {
        Attendance.find({})
          .where('dateOfAttendance')
          .gt(morning).exec(function(err, attendances) {
          attendances.forEach(function(item, index, arrrrr) {

            if (_.findWhere(users, {  _id: item._id}) ) {

              _.findWhere(users, {  _id: item._id  }).attendances = item;
            }
          })
          socket.emit('getInitialAttendance', users)

        })
      })
  }
};
