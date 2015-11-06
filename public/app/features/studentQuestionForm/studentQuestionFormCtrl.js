angular.module('theQ').controller('studentQuestionFormCtrl', function($scope, socketIoSrvc){
  var socket = socketIoSrvc.getSocket();
  socket.on('my current question is', function(result){
    console.log("I be hit 2");
    $scope.currentQuestion = result;
  });
});
