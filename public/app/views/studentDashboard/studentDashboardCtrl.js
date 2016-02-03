angular.module('theQ').controller('studentDashboardCtrl', function(socketIoSrvc, $scope, $element) {
    var socket = socketIoSrvc.getSocket();

    socket.emit('student login');
    socket.emit('get all learning objectives');

    socket.on('learning objectives are', learningObjectivesAre);
    socket.on('default objectives are', setDefaultObjectives);

    $scope.defaultObjectives = [{objectiveName:"Javascript"}, {objectiveName:"Angular"},{objectiveName:"Express"},{objectiveName:"Mongo"}];

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

    function setDefaultObjectives(data){
      $scope.defaultObjectives = data
    }

    $element.on('$destroy', function() {
        socket.off('learning objectives are', learningObjectivesAre);
        socket.off('default objectives are', setDefaultObjectives);
    })
});
