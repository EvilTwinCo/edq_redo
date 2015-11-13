var app = angular.module("theQ").controller("confidenceLiveChartCtrl", function ($scope, socketIoSrvc, $timeout) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    resetData();

    socket.emit('instructor login');

    socket.on('report confidence single', function (data) {
        //console.log('recieved report confidence single', data);
        if (data.cohortId === self.cohortId) {
            if (self.objData[data.objective_id]) {
                self.objData[data.objective_id][data.devMtnId] = data.value;
            } else {
                var temp = {};
                temp[data.devMtnId] = data.value;
                self.objData[data.objective_id] = temp;

            }
            cleanData();
        }
    });

    socket.on('reset view data', function () {
        //console.log('resetting data view');
        resetData();
        $scope.$apply();
    });

    function cleanData() {
        self.data = _.mapObject(self.objData, function (object, index) {
            return _.values(object);
        });
        $scope.$apply();
    }

    function resetData() {
        self.objData = {};
        self.data = {};
        socket.emit('get current confidences', self.cohortId);
    }
});
