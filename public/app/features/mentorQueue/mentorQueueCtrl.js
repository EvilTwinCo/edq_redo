angular.module('theQ').controller('mentorQueueCtrl',function(socketIoSrvc, $scope){



var socket = socketIoSrvc.getSocket();

this.questions = [];

socket.on('questionForQueue', function(data){
  console.log("data Recieved", data);
  console.log(this);
  this.questions.push(data);
  $scope.$apply();
}.bind(this));

socket.on('getAllQuestionsAsked', function(data){
  this.questions = data;
}.bind(this));


this.timeObject = function(){
  return new Date();

}
 this.ObjectEntersQ = function(object){
   object.timeWhenEnteredQ = this.timeObject();
   object.solved = false;
 }

 this.mentorBegins = function(object){
   object.timeMentorBegins = this.timeObject();
   //need mentor name
   object.mentorName = "Smelly guy"

 }

 this.questionResolve = function(object){
   object.timeQuestionAnswered = this.timeObject();
   object.removing = true;
 }

 this.addingQuestionAndSolution = function(object) {
   object.solved = true;
   socket.emit('exit queue information', object);
   console.log(object);

 };


//dummy data
  this.questions = [

    {name:'bob', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie shoes??", solution: '', mentorName: 'MARK'},
    {name:'joe', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie knots??", solution: '', mentorName: 'MARK'},
    {name:'mary', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie ties??", solution: '', mentorName: ''},
    {name:'paul', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie the knote??", solution: '', mentorName: 'MARK'},
    {name:'Ringo', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie a bow??", solution: '', mentorName: 'MARK'}

 ]

//endter q, mentorbegins help, leaveQ

})
