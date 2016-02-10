angular.module('theQ').directive('queueMonitor', function () {
    return {
        templateUrl: 'app/features/queueMonitor/queueMonitorTmpl.html',
        controller: 'queueMonitorCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }

});
