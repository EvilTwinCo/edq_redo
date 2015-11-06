angular.module('theQ').controller('solutionInputCtrl', function(socketIoSrvc, $rootScope) {

  console.log( "Solution Input Ctrl");
  var socket = socketIoSrvc.getSocket();

  this.question = this.props;

  this.noShareinput = function() {
    this.question.studentSolution = '';
    // socket.emit('studentDropFromQueue', si.question);
    this.question = {
      question: ''
    };
    console.log(this.onStudentSubmitSolution);
    this.onStudentSubmitSolution();
  }

  this.shareInput = function() {

    if (this.question.studentSolution != '') {
console.log(this.question);
      socket.emit('studentSolution', this.question);
      this.question = {
        question: ''
      };
      this.onStudentSubmitSolution();
    } else {

      this.question.studentSolution = '';
      // socket.emit('studentSolution', si.question);
      this.question = {
        question: ''
      };
      this.onStudentSubmitSolution();
    }
  }

  this.onStudentSubmitSolution = function(){
    $rootScope.$broadcast('clearCurrentQuestion');
  }

  //    solutionInputCtrl emits
  // 'studentSolution',{question: string, studentSolution: string or ''}

/**/
})
