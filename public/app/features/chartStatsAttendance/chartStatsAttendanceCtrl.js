var app = angular.module("theQ").controller("chartStatsAttendanceCtrl", function (socketIoSrvc) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    
    this.currentAttendanceType = {
        label: 'Chart by...',
        value: undefined
    }

    this.attendanceTypeOptions = [
        {
            label: 'Cohort',
            value: 'cohort'
        },
        {
            label: 'Individual',
            value: 'individual'
        },
    ]

    this.setDropdownValue = function (type) {
        this.currentAttendanceType = type;
    }

});