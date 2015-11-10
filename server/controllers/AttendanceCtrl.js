var Attendance = require('../models/Attendance');
var mongoose = require('mongoose');
var User = require('../models/User');
var _ = require('underscore');



module.exports = {
  //post not working
    postAttendance: function(socket, data) {
      console.log("AttendanceCtrl", data);
            //start of bryan's experiement

      Attendance.findById(data._id, function(err, attendance){

        if(attendance){
          attendance.attendanceData = data.attendanceData;

          attendance.save(function(err){
            if (err){
              console.log(err);
            }
            socket.emit('attendanceUpdate', attendance)
          })

        }else {
          new Attendance(data).save(function(error, data){
            if(error){
              console.log("OMG! Im on fire!!!", error)
            }
            else {
              console.log("not on fire")
              socket.emit("attendanceUpdate", data)
            }
          })
        }

})


      //end of bryan's experiement

        // Attendance.create(data, createAttendee)
        //     .exec(function(err, result) {
        //       if (err) {
        //         console.log(err);
        //       }
        //       socket.emit('postAttendance', result);
        //       console.log(result);
        //     });
          },
          ///add a search to get todoays
    getAttendance: function(socket, data) {

      User.find({}).exec(function(err, users){
        Attendance.find({}).exec(function(err, attendances){
          attendances.forEach(function(item, index, arrrrr){
            if(_.findWhere(users, {_id: item._id})){
              // console.log(_.findWhere(users, {_id: item._id}))
            _.findWhere(users, {_id: item._id}).attendances = item;
          }else{

          }
          })
          socket.emit('getInitialAttendance',users)
          console.log('emitted from server', users)
        })
      })


    }
  };
