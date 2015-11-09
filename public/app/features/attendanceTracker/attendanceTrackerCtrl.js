angular.module('theQ').controller('attendanceTrackerCtrl', function(socketIoSrvc) {

  var socket = socketIoSrvc.getSocket();

  this.getDateObject = function() {
    return new Date();
  }

  this.doIt = function() {
    $('select').material_select();
  }

  this.timeInButton = function(user) {
    user.attendanceData.timeIn = this.getDateObject();
    socket.emit(user);

  }.bind(this)

  this.timeOutButton = function(user) {
    user.attendanceData.timeOut = this.getDateObject();
    socket.emit(user);
  }.bind(this)



  this.changeScore = function(user, e) {
    console.log("event", e);
    console.log("user", user);
    socket.emit("getAttendance", user);
    console.log(user);
  }



  socket.on('getAttendance', function(arr) {
    this.users = arr;

  }.bind(this));



  this.users = [{
    firstName: "Bryan",
    lastName: "Schauerte",
    email: "Bryan@email.com",
    attendanceData: {
      // timeIn:
      // timeOut:
      // score:4
      // day:
    }
  }, {
    firstName: "Brack",
    lastName: "Carmony",
    email: "Brack@email.com",
    attendanceData: {
      // timeIn:
      // timeOut:
      // score:
      // day:
    }
  }, {
    firstName: "David",
    lastName: "Giles",
    email: "David@email.com",
    attendanceData: {
      // timeIn:
      // timeOut:
      // score:
      // day:
    }
  }, {
    firstName: "Samson",
    lastName: "Nelson",
    email: "Samson@email.com",
    attendanceData: {
      // timeIn:
      // timeOut:
      // score:
      // day:
    }
  }, {
    firstName: "Nathan",
    lastName: "Allen",
    email: "Nathan@email.com",
    attendanceData: {
      // timeIn:
      // timeOut:
      // score:
      // day:
    }
  }];




});
