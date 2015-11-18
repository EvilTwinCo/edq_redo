angular.module('theQ').controller('menuBarCtrl', function(socketIoSrvc, $scope, $window, $element) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    self.showAdminTags = false;
    
    socket.emit('client request: get auth level');

    socket.on('server response: get auth level', serverResponseGetAuthLevel);
    
    function serverResponseGetAuthLevel (data) {
        console.log('server response on auth:', data);
        if (data === 'admin') {
            self.showAdminTags = true;
            $scope.$apply();
            $window.location.href = '#/adminDashboard';
        }
    }
    
    $element.on('$destroy', function () {
        socket.on('server response: get auth level', serverResponseGetAuthLevel); 
    })
});