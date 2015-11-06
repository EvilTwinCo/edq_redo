var app = angular.module('theQ').directive("confidenceLiveChart", function () {
    return {
        templateUrl: "app/features/confidenceLiveChart/confidenceLiveChartTmpl.html",
        controller: "confidenceLiveChartCtrl",
        controllerAs: 'is',
        bindToController: true,
        attribute: "E",
        scope: {

        }
    }
})