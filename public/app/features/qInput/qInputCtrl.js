angular.module('theQ').controller('qInputCtrl', function($scope, socketIoSrvc){

    $scope.question = {directive:''};
    var day = [];
    var socket = socketIoSrvc.getSocket();

    socket.on('dayObjectives', function (arr){
      day = arr;
      })

  this.submitQuestion = function(obj){

      socket.emit('questionFromStudent', obj);

      //will be a {question: string, objective: string}
      socket.emit('student Question', obj)
      $scope.question = {directive:'', question: ''};
    }



// dummy data

  // this.day = {
  //   obj1: "learn things",
  //   obj2: "things about things",
  //   obj3: "things about cats",
  //   obj: "things about monkeys",
  //   obj5: "things about cheese"
  // };

  });
