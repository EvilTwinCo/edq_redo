angular.module('theQ').controller('solutionInputCtrl', function(socketIoSrvc) {

  var socket = socketIoSrvc.getSocket();

  this.question = this.props;

  this.noShareinput = function() {
    this.question.studentSubmittedSolution = '';
    // socket.emit('studentDropFromQueue', si.question);
    this.question = {
      question: ''
    };
  }

  this.shareInput = function() {

    if (this.question.studentSubmittedSolution != '') {
console.log(this.question);
      socket.emit('studentSolution', this.question);
      this.question = {
        question: ''
      };

    } else {

      this.question.studentSubmittedSolution = '';
      // socket.emit('studentSolution', si.question);
      this.question = {
        question: ''
      };

    }
  }

  //    solutionInputCtrl emits
  // 'studentSolution',{question: string, studentSubmittedSolution: string or ''}


})
