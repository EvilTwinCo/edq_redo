angular.module('theQ').directive('queueDashboard', function() {
    return {
        templateUrl: 'app/views/queueDashboard/queueDashboardTmpl.html',
        controller: 'queueDashboardCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});
