angular.module('theQ').service('socketIoSrvc', function() {

    var socket = io();
    
    // EVENT EMITS
    this.submitConfidence = function(obj) {
        socket.emit('submit confidence', obj);
    }

    // EVENT CAPTURES
    socket.on('report confidence', function(obj) {
        console.log('report confidence received: ', obj);
    });
    
    // GENERAL SOCKET.IO EVENT COMMUNCATION
    socket.on('connect', function() {
        console.log('connected');
    });

    socket.on('reconnect', function() {
        console.log('reconnecting');
    });

    socket.on('disconnect', function() {
        console.log('disconnecting');
    });

    socket.on('error', function() {
        console.log('connection error');
    });
});