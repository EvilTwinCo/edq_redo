angular.module('theQ').controller('solutionInputCtrl', function(socketIoSrvc, QuestionCtrl) {

  var socket = socketIoSrvc.getSocket();

  this.question = this.props;

  this.noShareinput = function() {
    this.question.studentSolution = '';
    // socket.emit('studentDropFromQueue', si.question);
    this.question = {
      question: ''
    };
  }

  this.shareInput = function() {

    if (this.question.studentSolution != '') {
console.log(this.question);
      socket.emit('studentSolution', this.question);
      this.question = {
        question: ''
      };

    } else {

      this.question.studentSolution = '';
      // socket.emit('studentSolution', si.question);
      this.question = {
        question: ''
      };

    }
  }

  //    solutionInputCtrl emits
  // 'studentSolution',{question: string, studentSolution: string or ''}


})
