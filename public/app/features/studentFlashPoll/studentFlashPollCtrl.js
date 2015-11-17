angular.module('theQ').controller('studentFlashPollCtrl', function(socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();
    //console.log(socket);
    var self = this;
    this.submitPoll = function(answer) {
        console.log('submitting ' + answer + '...');
        socket.emit('studentFlashPoll', answer);
        $scope.showPolls = false;
    };

    socket.on('togglePolls', function(data){
        console.log('togglePolls',data);
      $scope.showPolls = data;
      $scope.$apply();
    });

});
