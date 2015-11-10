angular.module('theQ').directive('chartStatsQueue', function() {
    return {
        templateUrl: 'app/features/chartStatsQueue/chartStatsQueueTmpl.html',
        controller: 'chartStatsQueueCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});
