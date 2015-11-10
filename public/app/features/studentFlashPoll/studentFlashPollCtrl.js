angular.module('theQ').controller('studentFlashPollCtrl', function(socketIoSrvc) {

    var socket = socketIoSrvc.getSocket();
    console.log(socket);

    this.submitPoll = function(answer) {
        console.log('submitting ' + answer + '...');
        socket.emit('studentFlashPoll', answer);
    }

});
