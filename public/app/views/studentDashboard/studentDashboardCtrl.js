angular.module('theQ').controller('studentDashboardCtrl', function(socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();

    socket.emit('get all learning objectives');
    socket.on('learning objectives are', function(data){
      console.log(data);
      console.log(data.objectives);
      $scope.objectives = data.objectives;
      $scope.trackables = data.trackables;
      $scope.$apply();
      console.log($scope.objectives);
    })
});
