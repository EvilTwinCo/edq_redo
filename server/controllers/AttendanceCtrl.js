var Attendance = require('../models/Attendance');
var mongoose = require('mongoose');
var User = require('../models/User');
var _ = require('underscore');



module.exports = {



  postAttendance: function(socket, data) {

    Attendance.findOne({'user' :data.user}, function(err, attendance) {

      if (attendance) {

        attendance.attendanceData = data.attendanceData;
        attendance.save(function(err) {
          if (err) {
            console.log(err);
          }
          console.log('SAving att', attendance)
          socket.emit('attendanceUpdate', attendance)
        })

      }
      else if(!attendance) {
        new Attendance(data).save(function(error, data) {

          if (error) {
            console.log("OMG! Im on fire!!!", error)
          } else {
            console.log("New one from server", data)
            socket.emit("attendanceUpdateWithNewAttenance", data)
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
           .where('attendanceData.dateOfAttendance')
           .gt(morning)
            .exec(function(err, attendances) {

            var daysAttendance = users.map(function(item){
              console.log(item);
              return {
                user: item._id,
                cohortId:item.devMtn.cohortId,
                firstName:item.firstName,
                lastName:item.lastName
              }

            })
          attendances.forEach(function(item, index, arrrrr) {
            if (_.findWhere(daysAttendance, {  user: item.user}) ) {

              var append = _.findWhere(users, {  user: item.user })
              // append.attendanceData = item.attendanceData;   old
              item.attendanceData = append.attendanceData;
              // append._id = item._id;
              // console.log("asdkfaksjdjjjjjjjjj", item)
            }
          })

          console.log("daysAttendance", daysAttendance);
          socket.emit('getInitialAttendance', daysAttendance)

        })
      })
  }
};
