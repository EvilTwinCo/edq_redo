var app = angular.module("theQ");

app.controller("confidenceLiveChartCtrl", function($scope){
  $scope.data = [];
  $scope.randomData = function(){
    var ary =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
    console.log(ary);
    for(var i=0;i<4;i++){
      $scope.data[i] = ary.map(function(){
        return Math.random()*100;
      })
    }
    console.log($scope.data);
  }

  $scope.randomData();
});
