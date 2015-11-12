angular.module('theQ').directive('chartStatsAttendance', function() {
    return {
        templateUrl: 'app/features/chartStatsAttendance/chartStatsAttendanceTmpl.html',
        controller: 'chartStatsAttendanceCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});