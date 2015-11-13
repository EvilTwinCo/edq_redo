angular.module('theQ').controller('studentFlashPollCtrl', function(socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();
    console.log(socket);

    this.submitPoll = function(answer) {
        console.log('submitting ' + answer + '...');
        socket.emit('studentFlashPoll', answer);
    }

    socket.on('togglePolls', function(data){
      $scope.showPolls = data;
      $scope.$apply();
    })

});
