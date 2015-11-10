angular.module('theQ').controller('studentFlashPollCtrl', function(socketIoSrvc) {

    var socket = socketIoSrvc.getSocket();

    this.submitPoll = function(answer) {
        console.log('submitting ' + answer + '...');
        socket.emit('submit flash poll', answer);
    }

});
