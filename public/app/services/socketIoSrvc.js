angular.module('theQ').service('socketIoSrvc', function() {

    var socket = io();

    this.getSocket = function() {
        return socket;
    }

      //{question: string, solution: string}
    this.submitLiveFeed= function(obj) {
        socket.emit('liveFeed', obj);
    }
///////////////////
    //for the mentorQueue
//////////////////

    //format    {name:string, pictureUrl: string, question:string, solution: string},

    this.submitOneQuestionToMentorQueue= function(obj) {
        socket.emit('questionForQueue', obj);
    }

    //format array full of objects   [{name:string, pictureUrl: string, question:string, solution: string}]
    this.submitAllQuestionsToMentorQueue= function(arr) {
        socket.emit('getAllQuestionsAsked', arr);
    }



    // EVENT CAPTURES
    socket.on('report confidence', function(obj) {
        console.log('report confidence received: ', obj);
    });

      //mentorQueue information coming back in an object
    socket.on('exit queue information', function(obj) {

      //example obj coming
      //{name:'bob', pictureUrl: string, reviewedQuestion: string, reviewedAnswer: string
      // question:"how do I tie shoes??", solution: '', mentorName: 'MARK', removing: bool, timeQuestionAnswered:dateObj, timeMentorBegins:dateObj, timeWhenEnteredQ:dateObj}
        console.log('exit queue information: ', obj);
    });

    // GENERAL SOCKET.IO EVENT COMMUNCATION
    socket.on('connect', function() {
        console.log('connected');


      // needs to send all questions in qu to mentorQueue
      //  socket.emit('serversLiveFeedStore', theStoredFeed)
      // sent as array of objects [{question:string, solution: string}]

    });

    socket.on('reconnect', function() {
        console.log('reconnecting');

        // needs to send all questions in qu to mentorQueue
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
