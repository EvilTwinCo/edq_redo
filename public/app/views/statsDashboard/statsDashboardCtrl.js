angular.module('theQ').controller('statsDashboardCtrl', function(socketIoSrvc, $scope, cohortSrvc) {
    var socket = socketIoSrvc.getSocket();
    var self = this;

    this.currentStatType = {
        label: 'Chart...',
        value: undefined
    };

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
    ];

    this.setStatDropdownValue = function (type) {
        this.currentStatType = type;
    };

    this.currentGroupType = {
        label: 'By...',
        value: undefined
    };

    this.groupTypeOptions = [
        {
            label: 'By Cohort',
            value: 'cohort'
        },
        {
            label: 'By All',
            value: 'all'
        }
    ];

    this.setGroupDropdownValue = function (type) {
        this.currentGroupType = type;

        if (this.currentGroupType.value === 'all') {
            this.currentSpecificType = {
                label: 'Cohort #?',
                value: 'all'
            };
        }
    };

    this.currentSpecificType = {
        label: 'Cohort #?',
        value: undefined
    };

    this.specificTypeOptions = [
        {
            label: 'Please wait...',
            value: 'undefined'
        }
    ];

    cohortSrvc.getCohortIds().then(function (res) {
        //console.log(res);
        self.specificTypeOptions = [];
        res.forEach(function (item) {
            self.specificTypeOptions.push({label: item, value: item});
        });
    }, function (err) {
        this.specificTypeOptions = [{
            label: 'Error loading.',
            value: undefined
        }];
    });

    /*this.specificTypeOptions = [
        {
            label: '27',
            value: '27'
        },
        {
            label: '28',
            value: '28'
        }
    ]*/

    this.setSpecificDropdownValue = function (type) {
        this.currentSpecificType = type;
    };

});
