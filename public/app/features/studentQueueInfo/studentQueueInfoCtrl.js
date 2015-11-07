angular.module('theQ').controller('studentQueueInfoCtrl', function (socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();
    
    socket.on('position in queue', function (index) {
        this.position = index;
        console.log(index);
        $scope.$apply();
    }.bind(this));

    this.removeSelfFromQueue = function () {
        this.question.timeQuestionAnswered = new Date();
        console.log(this.question);
        socket.emit("studentDropFromQueueTime", this.question.timeQuestionAnswered);
        socket.emit("request question removal", this.question);
        this.done();
    }
})