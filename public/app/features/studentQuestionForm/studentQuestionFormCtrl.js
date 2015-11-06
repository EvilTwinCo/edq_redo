angular.module('theQ').controller('studentQuestionFormCtrl', function($scope, socketIoSrvc){
  var socket = socketIoSrvc.getSocket();
  socket.emit('get my current question');
  socket.on('my current question is', function(result){
    console.log("I be hit 2");
    $scope.currentQuestion = result;
  });

  $scope.$on('clearCurrentQuestion', function(){
    $scope.currentQuestion = null;
  })

  socket.on('questionResolve', function(obj){
    console.log("Questio Resolve Student Question Form Ctrl");
    $scope.currentQuestion = obj;
    $scope.$apply();
  })

  $scope.callOnSolutionSubmit = function(){
    console.log("callOnSolutionSubmit called");
    $scope.currentQuestion = null;
    $scope.$apply();
  }
});
