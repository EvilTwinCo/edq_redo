angular.module('theQ').controller('studentQueueInfoCtrl', function (socketIoSrvc, $scope, $element) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    
    socket.on('position in queue', positionInQueue);

    function positionInQueue (index) {
        self.position = index;
        $scope.$apply();
    }
              
    this.removeSelfFromQueue = function () {
        this.question.timeQuestionAnswered = new Date();
        socket.emit("studentDropFromQueueTime", this.question.timeQuestionAnswered);
        socket.emit("request question removal", this.question);
        this.done();
    }
    
    $element.on('$destroy', function() {
        socket.on('position in queue', positionInQueue);
    })
})
