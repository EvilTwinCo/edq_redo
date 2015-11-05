angular.module('theQ').service('socketIoSrvc', function($location) {

    function readCookie(a, b) {
        b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

    console.log(readCookie('theQCookie.sid'));
    var cookieMonster = readCookie('theQCookie.sid');
    console.log(cookieMonster);
    console.log('+' + cookieMonster);

    var socket = io.connect('//'+window.location.host, {
      query:'session_id='+readCookie('theQCookie.sid')
    });

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

    socket.on('flash poll', function(answer) {
       console.log('flash poll received: ', answer);
    });

      //mentorQueue information coming back in an object
    socket.on('exit queue information', function(obj) {

      //example obj coming
      //{name:'bob', pictureUrl: string, reviewedQuestion: string, reviewedAnswer: string
      // question:"how do I tie shoes??", solution: '', mentorName: 'MARK', removing: bool, timeQuestionAnswered:dateObj, timeMentorBegins:dateObj, timeWhenEnteredQ:dateObj}
        console.log('exit queue information: ', obj);
    });


    socket.on('questionFromStudent', function(obj){

      //obj will be {question: string, directive: string}


    })

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

    socket.on('error', function(message) {
        console.log('connection error', message);
    });



});
