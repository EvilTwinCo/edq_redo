angular.module('theQ').directive('chartStatsConfidence', function() {
    return {
        templateUrl: 'app/features/chartStatsConfidence/chartStatsConfidenceTmpl.html',
        controller: 'chartStatsConfidenceCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});