var app = angular.module('theQ')

app.directive("attendanceTracker", function(){
  return {
    templateUrl:"app/features/attendanceTracker/attendanceTrackerTmpl.html",
    controller:"attendanceTrackerCtrl",
    controllerAs:'is',
    bindToController: true,
    attribute:"E",
    scope: {
      hideMenu: "=",
      cohortId: '='
    }
  }
})
