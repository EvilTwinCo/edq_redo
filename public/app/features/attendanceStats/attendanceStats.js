angular.module('theQ').directive('attendanceStats', function(){
  return {
    templateUrl: 'app/features/attendanceStats/attendanceStatsTmpl.html',
    controller: "attendanceStatsCtrl",
    controllerAs: 'is',
    bindToController: true,
    attribute: "E",
    scope: {
      cohortId: '='
    }

  }


});
