var app = angular.module('theQ').directive("flashPollMonitor", function(){
    return {
        templateUrl: "app/features/flashPollMonitor/flashPollMonitorTmpl.html",
        attribute: "E",
        controller: "flashPollMonitorCtrl",
        scope: {
            
        }
    }
})