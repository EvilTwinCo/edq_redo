angular.module('theQ').service('socketIoSrvc', function() {

    var socket = io();

    this.getSocket = function() {
        return socket;
    }

    // EVENT EMITS
    this.submitConfidence = function(obj) {
        socket.emit('submit confidence', obj);
    }

    this.sendStudentsObjectives = function(arr){
      socket.emit('dayObjectives', arr);
    }

      //{question: string, solution: string}
    this.submitLiveFeed= function(obj) {
        socket.emit('liveFeed', obj);
    }

    // EVENT CAPTURES
    socket.on('report confidence', function(obj) {
        console.log('report confidence received: ', obj);
    });


    socket.on('questionFromStudent', function(obj){

      //obj will be {question: string, directive: string}


    })

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
