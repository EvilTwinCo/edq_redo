angular.module('theQ').controller('menuBarCtrl', function(socketIoSrvc, $scope, $window, $element, $http, $location) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    self.showAdminTags = false;

    socket.on('server response: get auth level', serverResponseGetAuthLevel);

    function serverResponseGetAuthLevel (data) {
        if (data === 'admin') {
            self.showAdminTags = true;
            $scope.$apply();
            $window.location.href = '#/adminDashboard';
        }
        socket.off('server response: get auth level', serverResponseGetAuthLevel);
    }

    self.logoutUser = function(){
      $http.get('/logout').then(function(response){
        socket.disconnect();
        $location.path('/logout');
      },function(err){
        console.log(err);
      });
    };
});
