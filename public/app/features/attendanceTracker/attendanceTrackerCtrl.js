angular.module('theQ').controller('attendanceTrackerCtrl', function(socketIoSrvc, $scope) {
  var self = this;
  var socket = socketIoSrvc.getSocket();
  this.hideMenu = true;

this.showTimeChangeButton = false;


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


  this.updateTime = function(user){
    // user.attendanceData.timeIn = user.newTime;
          // socket.emit("postAttendance", user);
        self.formatAndPostAttendance(user);
  }

  this.timeOutButton = function(user) {
    user.attendanceData.timeOut = this.getDateObject();
    self.formatAndPostAttendance(user);

  }.bind(this)

  this.changeScore = function(user, e) {
    self.formatAndPostAttendance(user);

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
      // console.log("postAttendance", user)
      socket.emit("postAttendance", user);

    } else {
      ///////problens herererererere
            // console.log("postAttendance", user)
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
    var today = self.getDateObject();
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
