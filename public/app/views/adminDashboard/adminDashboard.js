angular.module('theQ').directive('adminDashboard', function() {
    return {
        templateUrl: 'app/views/adminDashboard/adminDashboardTmpl.html',
        controller: 'adminDashboardCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
        
        }
    }
});