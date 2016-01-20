angular.module('theQ').controller('studentQuestionFormCtrl', function (socketIoSrvc, $interval, $scope, $element) {
    var socket = socketIoSrvc.getSocket();
    this.state = 'q-input';
    var self = this;

    socket.emit('get my current question');

    socket.on('questionResolve', questionResolve);
    socket.on('my current question is', myCurrentQuestionIs);

    function myCurrentQuestionIs (result) {
        self.currentQuestion = result;
        if(self.currentQuestion) {
            if(self.currentQuestion.timeQuestionAnswered) {
                self.state = 'solution-input';
            } else {
                self.state = 'student-queue-info';
            }
            $scope.$apply();
        }
    }

    function questionResolve (obj) {
        self.currentQuestion = obj;
    }

    this.callOnSolutionSubmit = function () {
        this.currentQuestion = null;
    }

    this.cancelSolution = function() {
        this.currentQuestion = null;
    }

    this.next = function(state) {
        if (state === 'q-input') {
            this.currentQuestion = null;
        }
        this.state = state;
    }

    $element.on('$destroy', function () {
        socket.off('questionResolve', questionResolve);
        socket.off('my current question is', myCurrentQuestionIs);
    })
});
