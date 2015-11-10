angular.module('theQ').controller('statsDashboardCtrl', function(socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    
    this.currentStatType = {
        label: 'Select...',
        value: undefined
    }
    
    this.statTypeOptions = [
        {
            label: 'Attendance',
            value: 'chartStatsAttendance'
        },
        {
            label: 'Confidence',
            value: 'chartStatsConfidence'
        },
        {
            label: 'Queue',
            value: 'chartStatsQueue'
        }
    ]
    
    this.setDropdownValue = function (type) {
        this.currentStatType = type;
    }
});
