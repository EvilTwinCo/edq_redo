angular.module('theQ').service('socketIoSrvc', function($location) {

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

    socket.on('error', function(message) {
      if(message === "No session found"){
        $location.path('login');
      }
        console.log('connection error', message);
    });
});
