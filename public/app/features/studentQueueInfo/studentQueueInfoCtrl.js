angular.module('theQ').controller('studentQueueInfoCtrl', function (socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    
    socket.on('position in queue', function (index) {
        self.position = index;
        console.log(index);
        $scope.$apply();
    });

    this.removeSelfFromQueue = function () {
        this.question.timeQuestionAnswered = new Date();
        //console.log(this.question);
        socket.emit("studentDropFromQueueTime", this.question.timeQuestionAnswered);
        socket.emit("request question removal", this.question);
        this.done();
    }
})
