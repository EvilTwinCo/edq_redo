var app = angular.module('theQ').directive("flashPollMonitor", function(){
    return {
        templateUrl: "app/features/flashPollMonitor/flashPollMonitorTmpl.html",
        attribute: "E",
        controller: "flashPollMonitorCtrl",
        controllerAs: "fm",
        bindToController: true,
        scope: {
          votesArray : '='

        }
    }
})
