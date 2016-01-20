var app = angular.module('theQ').directive("d3VerticleDotDistribution", function () {
    return {
        templateUrl: "app/features/d3VerticleDotDistribution/d3VerticleDotDistributionTmpl.html",
        attribute: "A",
        controller: "d3VerticleDotDistributionCtrl",
        controllerAs: 'is',
        bindToController: true,
        scope: {
            data: "="
        }
    };
});
