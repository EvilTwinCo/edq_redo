var app = angular.module('theQ').directive("d3VerticleDotDistribution", function () {
    return {
        templateUrl: "app/features/d3VerticleDotDistribution/d3VerticleDotDistributionTmpl.html",
        attribute: "A",
        controller: "d3VerticleDotDistributionCtrl",
        controllerAs: 'is',
        bindToController: true,
        scope: {
            data: "="
        },
        /*link: function (scope, elem, atts) {
            console.log(elem);
            console.log(elem.find('svg'));
            scope.svg = elem.find('svg');

            scope.svg.attr("id", "chartToSelect");
            scope.chart = d3.select("#chartToSelect");
            scope.svg.attr("id", "chart");
        }*/
    }
})