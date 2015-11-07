angular.module('theQ').controller('studentQuestionFormCtrl', function (socketIoSrvc, $interval, $scope) {
    var socket = socketIoSrvc.getSocket();
    this.state = 'q-input';
    socket.emit('get my current question');
    var self = this;
    
    socket.on('my current question is', function (result) {
        self.currentQuestion = result;
        //console.log(self.currentQuestion);
        
        if(self.currentQuestion) {
            if(self.currentQuestion.timeQuestionAnswered) {
                self.state = 'solution-input';
            } else {
                self.state = 'student-queue-info';
                
            }
            $scope.$apply();
            console.log(self.state);
        }
        
    });

    socket.on('questionResolve', function (obj) {
        this.currentQuestion = obj;
    }.bind(this));

    this.callOnSolutionSubmit = function () {
        console.log("callOnSolutionSubmit called");
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
        console.log(this.state);
    }
});
