var app = angular.module("theQ");

app.controller("learningObjectiveCtrl", function($scope){
  
  $scope.learningObjectives = $scope.is.learningObjectives;
  $scope.learningObjectives = [{title:"Creating a folder"}, {title:"Creating a file"},{title:"Editing a file"}, {title:"Changing Directories"}]
});
