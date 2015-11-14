var app = angular.module('theQ').directive("d3LineChart", function () {
    return {
        templateUrl: "app/features/d3LineChart/d3LineChartTmpl.html",
        attribute: "A",
        controller: "d3LineChartCtrl",
        controllerAs: 'is',
        bindToController: true,
        scope: {
            data: "="
        },
    }
})