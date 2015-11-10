angular.module('theQ').controller('attendanceTrackerCtrl', function(socketIoSrvc, $scope) {
  var self = this;
  var socket = socketIoSrvc.getSocket();
  this.hideMenu = false;

  this.getTheUsersForCohort = function() {
    socket.emit('getAttendance');
  }

  this.getTheUsersForCohort();

  this.hideDisplay = function() {
    this.hideMenu = !this.hideMenu;
  }

  this.getDateObject = function() {
    return new Date();
  }

  this.doIt = function() {
    $('select').material_select();
  }

  this.timeInButton = function(user) {
    user.attendanceData.timeIn = this.getDateObject();
    self.formatAndPostAttendance(user);

  }.bind(this)

  this.timeOutButton = function(user) {
    user.attendanceData.timeOut = this.getDateObject();
    self.formatAndPostAttendance(user);

  }.bind(this)

  this.changeScore = function(user, e) {
    self.formatAndPostAttendance(user);
    console.log('postAttendance', user)
  }

  this.formatAndPostAttendance = function(user) {
    if (typeof user.attendanceData.score == 'string') {

      switch (user.attendanceData.score) {
        case ('number:1'):
          user.attendanceData.score = 1;
          break;
        case ('number:2'):
          user.attendanceData.score = 2;
          break;
        case ('number:3'):
          user.attendanceData.score = 3;
          break;
      }
      socket.emit("postAttendance", user);
    } else {
      socket.emit("postAttendance", user);
    }
  }

  this.users = [];

  socket.on('attendanceUpdate', function(data) {
    this.users.forEach(function(item, index, arr) {
      if (item.user == data.user) {
        arr[index].attendanceData = data.attendanceData;
      }
    })
  }.bind(this));



  socket.on('getInitialAttendance', function(data) {
    var today = self.getDateObject();
    data.forEach(function(item, index, array) {
      if (item.devMtn.cohortId == self.cohortId) {
        if (!item.attendanceData) {
          item.attendanceData = {
            timeIn: null,
            timeOut: null,
            score: null,
            dateOfAttendance: today
          };
          self.users.push(item);

        } else {

          self.users.push(item);
        }
      }
    })
    $scope.$apply();
  })
});
