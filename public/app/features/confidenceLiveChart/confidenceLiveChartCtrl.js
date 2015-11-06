var app = angular.module("theQ").controller("confidenceLiveChartCtrl", function ($scope, socketIoSrvc) {

    var socket = socketIoSrvc.getSocket();
    $scope.objData = {};
    socket.emit('instructor login');
    socket.on('report confidence', function (data) {

        $scope.objData = data;
        cleanData();

        $scope.$apply();
    });
    socket.on('report confidence single', function (data) {
        console.log('recieved report confidence single', data);
        if ($scope.objData[data.objective_id]) {
            $scope.objData[data.objective_id][data.socketId] = data.value;
        } else {
            var temp = {};
            temp[data.socketId] = data.value;
            $scope.objData[data.objective_id] = temp;
        }
        cleanData();

        $scope.$apply();
    });

    function cleanData() {
        $scope.data = _.mapObject($scope.objData, function (object, index) {
            return _.values(object);
        })
    }
});