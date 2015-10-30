angular.module('theQ').directive('studentDashboard', function() {
    return {
        templateUrl: 'app/views/studentDashboard/studentDashboardTmpl.html',
        controller: 'studentDashboardCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
        
        }
    }
});