angular.module('theQ').service('socketIoSrvc', function() {

    var socket = io();

    this.getSocket = function() {
        return socket;
    }

    // GENERAL SOCKET.IO EVENT COMMUNCATION
    socket.on('connect', function() {
        console.log('connected');

      //  socket.emit('serversLiveFeedStore', theStoredFeed)
      // sent as array of objects [{question:string, solution: string}]

    });

    socket.on('reconnect', function() {
        console.log('reconnecting');

        //  socket.emit('serversLiveFeedStore', theStoredFeed)
        // sent as array of objects [{question:string, solution: string}]
    });

    socket.on('disconnect', function() {
        console.log('disconnecting');
    });

    socket.on('error', function() {
        console.log('connection error');
    });



});
