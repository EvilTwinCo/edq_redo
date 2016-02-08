angular.module('theQ').service('socketIoSrvc', function($location) {

    function readCookie(a, b) {
        b = document.cookie.match('(^|;)\\s*' + a + '\\s*=\\s*([^;]+)');
        return b ? b.pop() : '';
    }

    var socket;
    this.connectSocket = function(){
      socket = io.connect('//'+window.location.host, {
        query:'session_id='+readCookie('theQCookie.sid')
      });
    };

    this.connectSocket();

    this.getSocket = function() {
        return socket;
    };

    // GENERAL SOCKET.IO EVENT COMMUNCATION
    socket.on('connect', function() {
        console.log('connected');
        socket.emit('client request: get auth level');
    });

    socket.on('reconnect', function() {
        console.log('reconnecting');
    });

    socket.on('disconnect', function() {
        console.log('disconnecting');
    });

    socket.on('error', function(message) {
        console.log('connection error', message);
        if(message === "No session found"){
          $location.path('/login');
        }
    });

    socket.on('server response: get auth level', function(data){
      //console.log('server response on auth:', data);
      if (data === 'admin') {
          socket.emit('instructor login');
      }
    });

    socket.on('notAdmin', function(message){
      console.log('No admin privilages');
      $location.path('/login');
    })


});
