angular.module('theQ').service('socketIoSrvc', function() {

    var socket = io();
    
    this.getSocket = function() {
        return socket;
    }

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