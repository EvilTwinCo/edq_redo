angular.module('theQ').controller('studentDashboardCtrl', function(socketIoSrvc, $scope, $element) {
    var socket = socketIoSrvc.getSocket();

    socket.emit('student login');
    socket.emit('get all learning objectives');
    
    socket.on('learning objectives are', learningObjectivesAre);
    
    function learningObjectivesAre (data){
        $scope.objectives = data.objectives.map(function(item){
            item.percentage = 0
            return item;
        });
        $scope.trackables = data.trackables;
        $scope.$apply();
    }
    
    $element.on('$destroy', function() {
        socket.off('learning objectives are', learningObjectivesAre); 
    })
});
