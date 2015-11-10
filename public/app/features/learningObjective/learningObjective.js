var app = angular.module('theQ').directive('learningObjective', function(){
  return {
    templateUrl: 'app/features/learningObjective/learningObjectiveTmpl.html',
    controller: 'learningObjectiveCtrl',
    controllerAs:'is',
    bindToController: true,
    attribute: "E",
    scope:{
      learningObjectives:"=objectives"
    }
  }
})
