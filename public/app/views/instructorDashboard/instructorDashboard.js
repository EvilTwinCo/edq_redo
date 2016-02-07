angular.module('theQ').directive('instructorDashboard', function() {
    return {
        templateUrl: 'app/views/instructorDashboard/instructorDashboardTmpl.html',
        controller: 'instructorDashboardCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});
