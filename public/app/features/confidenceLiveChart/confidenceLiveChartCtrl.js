var app = angular.module("theQ").controller("confidenceLiveChartCtrl", function ($scope, socketIoSrvc, $timeout) {
    var socket = socketIoSrvc.getSocket();
    var self = this;

    //socket.emit('instructor login');

    $scope.$watch('is.cohortId', function() {
        console.log('watch cohortId seen');
        resetData();
    })
    
    socket.on('report confidence single', function (data) {
        //console.log('recieved report confidence single', data);
        if (data.cohortId === self.cohortId) {
            if (self.objData[data.objective_topic]) {
                self.objData[data.objective_topic][data.devMtnId] = data.value;
            } else {
                var temp = {};
                temp[data.devMtnId] = data.value;
                self.objData[data.objective_topic] = temp;
            }
            cleanData();
        }
    });

    console.log(socket._callbacks['reset view data']);
    if (socket._callbacks['reset view data'] === undefined) {
        socket.on('reset view data', function () {
            console.log(socket);
            console.log('resetting data view');
            resetData();
            $scope.$apply();
        })
    }

    function cleanData() {
        self.data = _.mapObject(self.objData, function (object, index) {
            return _.values(object);
        });
        
        self.dataLabels = _.keys(self.objData);
        //console.log(self.dataLabels);
        $scope.$apply();
    }

    function resetData() {
        self.objData = {};
        self.data = {};
        socket.emit('get current confidences', self.cohortId);
    }
});
