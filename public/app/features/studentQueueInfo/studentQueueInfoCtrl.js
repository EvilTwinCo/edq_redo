angular.module('theQ').controller('studentQueueInfoCtrl',function(socketIoSrvc, $scope){

var socket = socketIoSrvc.getSocket();

this.askForSolution = false;
this.question = {question:'123'};
this.timeObject =function(){
  return new Date()
}


this.getInput = function(){
    this.askForSolution = true;
    this.showQueueInfo = false;
    this.timeDropFromQueue = this.timeObject();
    console.log(this.timeDropFromQueue)
    socket.emit("studentDropFromQueueTime", this.timeDropFromQueue);
}


socket.on('my current question is', function(obj){
  console.log('current question', obj);
  this.question.question = obj.question;
  this.question._id = obj.question._id;
  this.showQueueInfo = true;
  $scope.$apply();
}.bind(this))

socket.on('position in queue', function(index){
  console.log("I be hit");
  this.question.queuePlace = index;
  $scope.$apply();
}.bind(this));

socket.on('questionResolve', function(obj){
  console.log('question Resolve', obj);
  this.question = obj;
  this.askForSolution = true;
  this.showQueueInfo = false;
}.bind(this))



//    solutionInputCtrl emits
// 'studentSolution',{question: string, studentSubmittedSolution: string or ''}


// studentQueueInfoCtrl
// has a listener with "questionAnswered", needs obj= {question:string}
//has a listener 'questionCreated', needs obj= {question:string, queuePlace: integer }
//emits 'studentDropFromQueueTime', dateObject




})
