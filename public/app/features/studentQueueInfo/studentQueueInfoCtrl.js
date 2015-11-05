angular.module('theQ').controller('studentQueueInfoCtrl',function(socketIoSrvc){

var socket = socketIoSrvc.getSocket();

this.askForSolution = false;
this.showQueueInfo = false;
// this.question = {question: "whoa, why???", queuePlace: 4}
// this.showQueueInfo = true;
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


socket.on('questionCreated', function(obj){
  this.question = obj;
  this.showQueueInfo = true;
})


socket.on('questionAnswered', function(obj){
  this.question = obj;
  this.askForSolution = true;
  this.showQueueInfo = false;
})



//    solutionInputCtrl emits
// 'studentSolution',{question: string, studentSubmittedSolution: string or ''}


// studentQueueInfoCtrl
// has a listener with "questionAnswered", needs obj= {question:string}
//has a listener 'questionCreated', needs obj= {question:string, queuePlace: integer }
//emits 'studentDropFromQueueTime', dateObject




})
