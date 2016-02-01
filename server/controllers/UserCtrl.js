var User = require('../models/User.js');
var _ = require('underscore');

function adminAuth(socket,obj){
  var roles = socket.request.user.devMtn.roles;
  roles = _.pluck(roles, 'role');
  adminRoles = _.intersection(roles,['lead_instructor', 'mentor', 'instructor']);
  if (adminRoles.length ==0){
    socket.emit('notAdmin')
    return false;
  }
  return true;
}

module.exports = {
    handleInstructorLogin: function (socket, obj) {
        if(!adminAuth(socket, obj)){
          return false;
        }
        var found = false;
        for (var i=0; i<socket.rooms.length; i++) {
            if (socket.rooms[i] === 'instructors') {
                found = true;
                break;
            }
        }
        if (!found) {
            //console.log("Instructor Logging In");
            socket.join('instructors');
        }
    },
    handleStudentLogin: function (socket, obj) {
        var found = false;
        for (var i=0; i<socket.rooms.length; i++) {
            if (socket.rooms[i].indexOf('student cohort:') !== -1) {
                found = true;
                break;
            }
        }
        if (!found) {
            //console.log("Student Logging In");
            socket.join('student cohort:'+socket.request.user.devMtn.cohortId);
        }
    },
    handleGetAuthRequest: function (socket, obj) {
        var role;
        //console.log(socket.request.user.devMtn.roles);
        var rawRolesArray = socket.request.user.devMtn.roles;
        var rolesOnlyArray = _.pluck(rawRolesArray, 'role');
        if (rolesOnlyArray.indexOf('mentor') !== -1 || rolesOnlyArray.indexOf('instructor') !== -1 || rolesOnlyArray.indexOf('lead_instructor') !== -1) {
            //console.log(socket.request.user.devMtn.id + ' is joining as an admin.');
            role = 'admin';
        } else {
            //console.log(socket.request.user.devMtn.id + ' is joining as a student for cohort ' + socket.request.user.devMtn.cohortId);
            role = 'student';

        }
        socket.emit('server response: get auth level', role);
    }
  };
