angular.module("theQ"). directive('solutionInput', function(){


return {
  templateUrl: "app/features/solutionInput/solutionInput.html",
  controller: "solutionInputCtrl",
  controllerAs: "si",
  bindToController: true,
  attribue: "E",
  scope: {
    props: "="
  }
}


})
