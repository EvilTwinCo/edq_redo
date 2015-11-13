angular.module('theQ').controller('attendanceTrackerCtrl', function(socketIoSrvc, $scope) {
  var self = this;
  var socket = socketIoSrvc.getSocket();
  this.hideMenu = true;
  this.changingTimeIn = false;
  this.changingTimeOut = false;

  this.tempUser = {};

  this.doIt = function() {
    $('select').material_select();
  }

this.setTimeToNineAm = function(){
  var today = function(){
    return new Date();
  }
    var nineOclock = new Date();

    return new Date(nineOclock.setHours(9,0,0));

}


  this.getTheUsersForCohort = function() {
    socket.emit('getAttendance');
  }

  this.hideDisplay = function() {
      this.getTheUsersForCohort();
    this.hideMenu = !this.hideMenu;
  }

  this.getDateObject = function() {
    return new Date();
  }

  this.timeInButton = function(user) {

    this.showTimeChangeButton = true;
    user.attendanceData.timeIn = this.setTimeToNineAm();
    console.log(user, "the time in button");
    self.formatAndPostAttendance(user);

  }.bind(this)



this.startChangeTimeIn = function(user){
    self.changingTimeIn = !self.changingTimeIn;
    self.tempUser = user;

}

this.setNewTimeIn = function(time){


  var hours = time.getHours();
  var mins = time.getMinutes();
  var seconds = time.getSeconds();
  var now = new Date();
  now.setHours(hours, mins, seconds);
  self.tempUser.attendanceData.timeIn  = now;
  self.formatAndPostAttendance(self.tempUser);
  self.changingTimeIn = !self.changingTimeIn;

}



this.startChangeTimeOut = function(user){
    self.changingTimeOut = !self.changingTimeOut;
    self.tempUser = user;

}

this.setNewTimeOut = function(time){


  var hours = time.getHours();
  var mins = time.getMinutes();
  var seconds = time.getSeconds();
  var now = new Date();
  now.setHours(hours, mins, seconds);
  console.log(now);
  self.tempUser.attendanceData.timeOut  = now;
  self.formatAndPostAttendance(self.tempUser);
  self.changingTimeOut = !self.changingTimeOut;

}
  $scope.$watch('self.users', function(newValue, oldValue) {


});






  this.timeOutButton = function(user) {
    user.attendanceData.timeOut = this.getDateObject();
    self.formatAndPostAttendance(user);

  }.bind(this)

  this.changeScore = function(user, e) {
    self.formatAndPostAttendance(user);

  }


  this.dateForCheckingAttendanceDate = function(){
    var today = function(){
      return new Date();
    }
      var zeroOclock = new Date();

      return new Date(zeroOclock.setHours(0,0,0,0));

  }

  this.formatAndPostAttendance = function(user) {

    var today = self.dateForCheckingAttendanceDate();
    user.todayDate = today;

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
      // console.log("postAttendance", user)
      socket.emit("postAttendance", user);
      console.log("posting", user)

    } else {
      ///////problens herererererere
            console.log("postAttendance", user)
      socket.emit("postAttendance", user);

    }
  }

  this.users = [];
//only new
  socket.on('attendanceUpdateWithNewAttenance', function(data) {

    self.users.forEach(function(item, index, arr) {
      if (item._id == data.user) {
        item.attendanceData = data.attendanceData;
      }
    })

    // _.findWhere(this.users,{_id:data.user})._id = data._id;

  }.bind(this));



  socket.on('getInitialAttendance', function(freshUsers) {


    self.users =[];
    var today = self.dateForCheckingAttendanceDate();
    freshUsers.forEach(function(item, index, array) {
      if (item.cohortId == self.cohortId) {

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
    // console.log(self.users);
    $scope.$apply();
  })
});
