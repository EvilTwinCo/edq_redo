var User = require('../models/User.js');
var _ = require('underscore');

module.exports = {
    handleInstructorLogin: function (socket, obj) {
        console.log("Instructor Logging In");
        socket.join('instructors');
    },
    handleStudentLogin: function (socket, obj) {
        console.log("Student Logging In");
        socket.join('student cohort:'+socket.request.user.devMtn.cohortId);
    },
    handleGetAuthRequest: function (socket, obj) {
        var role;
        console.log(socket.request.user.devMtn.roles);
        var rawRolesArray = socket.request.user.devMtn.roles;
        var rolesOnlyArray = _.pluck(rawRolesArray, 'role');
        if (rolesOnlyArray.indexOf('mentor') !== -1 || rolesOnlyArray.indexOf('instructor') !== -1) {
            socket.join('instructors');
            console.log(socket.request.user.devMtn.id + ' is joining as an admin.');
            role = 'admin';
        } else {
            socket.join('student cohort:'+socket.request.user.devMtn.cohortId);
            console.log(socket.request.user.devMtn.id + ' is joining as a student for cohort ' + socket.request.user.devMtn.cohortId);
            role = 'student';
            
        }
        socket.emit('server response: get auth level', role);
    }
  };
