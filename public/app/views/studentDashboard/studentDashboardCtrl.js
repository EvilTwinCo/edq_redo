angular.module('theQ').controller('studentDashboardCtrl', function(socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();

    socket.emit('student login');
    
    socket.emit('get all learning objectives');
    socket.on('learning objectives are', function(data){
      console.log(data);
      console.log(data.objectives);
      $scope.objectives = data.objectives.map(function(item){
        item.percentage = 0
        return item;
      });
      $scope.trackables = data.trackables;
      $scope.$apply();
      console.log($scope.objectives);
    })
});
