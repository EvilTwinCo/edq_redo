angular.module('theQ').directive('queueStatsChart', function() {
    return {
        templateUrl: 'app/features/queueStatsChart/queueStatsChartTmpl.html',
        controller: 'queueStatsChartCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});
