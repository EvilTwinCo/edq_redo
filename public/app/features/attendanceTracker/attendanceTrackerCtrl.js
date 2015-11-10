angular.module('theQ').controller('attendanceTrackerCtrl', function(socketIoSrvc, $scope) {

  var socket = socketIoSrvc.getSocket();

  this.getTheUsersForCohort = function(){
    socket.emit('getAttendance');
  }


  this.getTheUsersForCohort();


var self = this;


  this.hideMenu = false;

  this.hideDisplay = function(){
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
    socket.emit("postAttendance", user);

  }.bind(this)

  this.timeOutButton = function(user) {
    user.attendanceData.timeOut = this.getDateObject();
    socket.emit("postAttendance", user);
  }.bind(this)



  this.changeScore = function(user, e) {
    socket.emit("postAttendance", user);
    console.log('postAttendance', user)

  }



  // socket.on('getAttendance', function(arr) {
  //   this.users = arr;
  //
  // }.bind(this));
  this.users =[];

  socket.on('attendanceUpdate', function(data){
    this.users.forEach(function(item, index, arr){
      if (item.user == data.user){
        arr[index].attendanceData = data.attendanceData;
      }
    })
  }.bind(this));



socket.on('getInitialAttendance', function(data){


  data.forEach(function(item, index, array){


    if(item.devMnt.cohortId == self.cohortId){
      if(!item.attendanceData){
        item.attendanceData = {};
        self.users.push(item);
      }else {
      self.users.push(item);
      console.log(item, "pushed item");
    }
    }
  })
  $scope.$apply();
  console.log("the users listed", self.users)
})

//
// $scope.$watch('is.users', function(newValue, oldValue){
//   self.users = newValue;
//
// })

// $scope.$digest();

//   this.users = [{
//     firstName: "Bryan",
//     lastName: "Schauerte",
//     email: "Bryan@email.com",
//     attendanceData: {
//       // timeIn:
//       // timeOut:
//       // score:4
//       // day:
//     }
//   }
//   // , {
//   //   firstName: "Brack",
//   //   lastName: "Carmony",
//   //   email: "Brack@email.com",
//   //   attendanceData: {
//   //     // timeIn:
//   //     // timeOut:
//   //     // score:
//   //     // day:
//   //   }
//   // }, {
//   //   firstName: "David",
//   //   lastName: "Giles",
//   //   email: "David@email.com",
//   //   attendanceData: {
//   //     // timeIn:
//   //     // timeOut:
//   //     // score:
//   //     // day:
//   //   }
//   // }, {
//   //   firstName: "Samson",
//   //   lastName: "Nelson",
//   //   email: "Samson@email.com",
//   //   attendanceData: {
//   //     // timeIn:
//   //     // timeOut:
//   //     // score:
//   //     // day:
//   //   }
//   // }, {
//   //   firstName: "Nathan",
//   //   lastName: "Allen",
//   //   email: "Nathan@email.com",
//   //   attendanceData: {
//   //     // timeIn:
//   //     // timeOut:
//   //     // score:
//   //     // day:
//   //   }
//   // }
// ];


  console.log("the users listed", self.users)
});
