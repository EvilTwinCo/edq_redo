angular.module('theQ').controller('studentDashboardCtrl', function(socketIoSrvc, $scope, $element) {
    var socket = socketIoSrvc.getSocket();

    socket.emit('student login');
    socket.emit('get all learning objectives');

    socket.on('learning objectives are', learningObjectivesAre);

    function learningObjectivesAre (data){
      console.log(data);
        $scope.objectives = data.objectives.map(function(item){
            item.percentage = 0
            return item;
        });
        $scope.trackables = _.groupBy(data.trackables,function (item){
          return item.sectionTitle;
        });
        $scope.$apply();
    }

    $element.on('$destroy', function() {
        socket.off('learning objectives are', learningObjectivesAre);
    })
});
