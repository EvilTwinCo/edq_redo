angular.module('theQ').controller('studentQueueInfoCtrl',function(socketIoSrvc, $scope){

var socket = socketIoSrvc.getSocket()
this.askForSolution = false;
this.showUserInput = true;

this.getDataObject function(){
  return new Date;
}

this.getInput = function(){
    this.askForSolution = true;
    this.showUserInput = false;
    $scope.question.timeDropFromQueue = this.timeObject();
}


this.noShareinput = function(){
  $scope.question.studentSubmittedSolution = '';
  socket.emit('studentDropFromQueue', $scope.question);
  console.log($scope.question)
  $scope.question = { question: ''};
  this.askForSolution = false;
}

this.shareInput = function(){
  if($scope.question.studentSubmittedSolution != ''){
    socket.emit('studentDropFromQueue', $scope.question);
      console.log($scope.question)
    $scope.question = { question: ''};
    this.askForSolution = false;
  }
}

socket.on('questionCreated', function(obj){
  $scope.question = obj;
})



})
