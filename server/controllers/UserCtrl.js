var User = require('../models/User.js');

module.exports = {
    handleInstructorLogin: function (socket, obj) {
        console.log("Instructor Logging In");
        socket.join('instructors');
    },
    handleStudentLogin: function (socket, obj) {
        console.log("Student Logging In");
        socket.join('student cohort:'+socket.request.user.devMtn.cohortId);
    }
  };
