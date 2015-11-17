angular.module('theQ').service('socketIoSrvc', function($location) {

    this.showPolls = false;

    function readCookie(a, b) {
        b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

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

//format sent array of values from the vote [1, 1, 1, 1, 1, 1, 1, 3, 3, 3, 3]
  this.sendVoteResults = function(arr){
    socket.emit('flashVoteResults', arr);

  }


    // EVENT CAPTURES
      //mentorQueue information coming back in an object
    socket.on('exit queue information', function(obj) {
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

    socket.on('error', function(message) {
      if(message === "No session found"){
        $location.path('login');
      }
        console.log('connection error', message);
    });

    this.togglePolls = function(){
      this.showPolls = !this.showPolls;
    }


});
