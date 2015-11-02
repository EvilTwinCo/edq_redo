angular.module('theQ').controller('mentorQueueCtrl',function(){



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
 object.mentorName = "SMelly guy"

 }

 this.questionResolve = function(object){
   object.timeQuestionAnswered = this.timeObject();
   object.removing = true;
//need to send the object to the server here?

 }

 this.addingQuestionAndSolution = function(object) {
   object.solved = true;
console.log(object);
   //here push the object to the db   object is an individual q

 }


//dummy data
 //  this.question = [
 //
 //    {name:'bob', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie shoes??", solution: '', mentorName: 'MARK'},
 //    {name:'joe', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie knots??", solution: '', mentorName: 'MARK'},
 //    {name:'mary', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie ties??", solution: '', mentorName: ''},
 //    {name:'paul', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie the knote??", solution: '', mentorName: 'MARK'},
 //    {name:'Ringo', pictureUrl: 'http://myprofile.bryanschauerte.com/app/images/IMG_1067.jpg', question:"how do I tie a bow??", solution: '', mentorName: 'MARK'}
 //
 // ]

//endter q, mentorbegins help, leaveQ

})
