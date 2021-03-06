angular.module('theQ').controller('studentFlashPollCtrl', function(socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();
    //console.log(socket);
    var self = this;

    socket.emit('client request: get flash poll status');

    this.submitPoll = function(answer) {
        socket.emit('studentFlashPoll', answer);
        $scope.showPolls = false;
    };

    socket.on('togglePolls', function(data){
      $scope.showPolls = data;
      $scope.$apply();
    });

});
