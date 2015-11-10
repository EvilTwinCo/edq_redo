angular.module('theQ').directive('statsDashboard', function() {
    return {
        templateUrl: 'app/views/statsDashboard/statsDashboardTmpl.html',
        controller: 'statsDashboardCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});
