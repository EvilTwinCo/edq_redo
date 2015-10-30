var app = angular.module('theQ')

app.directive("learningObjective", function(){
  return {

    templateUrl:"app/features/learning-objective/learning_objective_tmpl.html",
    controller:"learningObjectiveCtrl",
    controllerAs:'is',
    bindToController:true,
    attribute:"E",
    scope:{
      
    }
  }
})
