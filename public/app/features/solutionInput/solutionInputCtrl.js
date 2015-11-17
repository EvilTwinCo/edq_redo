angular.module('theQ').controller('solutionInputCtrl', function (socketIoSrvc) {

    var socket = socketIoSrvc.getSocket();

    this.noShareinput = function () {
        this.done();
    };

    this.shareInput = function () {
        if (this.question.studentSolution !== '') {
            socket.emit('studentSolution', this.question);
            this.done();
        } else {
            alert('You must add a solution first...');
        }
    };
});
