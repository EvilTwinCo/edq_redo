angular.module('theQ').controller('studentQuestionFormCtrl', function($scope, socketIoSrvc){
  var socket = socketIoSrvc.getSocket();
  socket.on('my current question is', function(result){
    console.log("I be hit 2");
    $scope.currentQuestion = result;
  });

  $scope.$on('clearCurrentQuestion', function(){
    $scope.currentQuestion = null;
  })

  socket.on('questionResolve', function(obj){
    console.log("Questio Resolve Student Question Form Ctrl");
    $scope.question = obj;
  })

  $scope.callOnSolutionSubmit = function(){
    console.log("callOnSolutionSubmit called");
    $scope.currentQuestion = null;
    $scope.$apply();
  }
});
