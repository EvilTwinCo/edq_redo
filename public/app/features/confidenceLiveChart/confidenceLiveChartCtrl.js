var app = angular.module("theQ").controller("confidenceLiveChartCtrl", function ($scope, socketIoSrvc, $timeout, $element) {
    var socket = socketIoSrvc.getSocket();
    var self = this;

    $scope.$watch('is.cohortId', function() {
        console.log('watch cohortId seen');
        resetData();
    })
    
    socket.on('report confidence single', reportConfidenceSingle);
    socket.on('reset view data', resetViewData);
    
    function reportConfidenceSingle (data) {
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
    }
    
    function resetViewData () {
        console.log(socket);
        console.log('resetting data view');
        resetData();
        $scope.$apply();
    }

    function cleanData() {
        self.data = _.mapObject(self.objData, function (object, index) {
            return _.values(object);
        });
        self.dataLabels = _.keys(self.objData);
        $scope.$apply();
    }

    function resetData() {
        self.objData = {};
        self.data = {};
        socket.emit('get current confidences', self.cohortId);
    }
    
    $element.on('$destroy', function() {
        socket.off('report confidence single', reportConfidenceSingle);
        socket.off('reset view data', resetViewData);
    })
});
