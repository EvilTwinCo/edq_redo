var app = angular.module("theQ");

app.controller("confidenceLiveChartCtrl", function($scope, socketIoSrvc){
  var socket = socketIoSrvc.getSocket();
  $scope.objData = {};
  socket.emit('instructor login');
  socket.on('report confidence', function(data){

    $scope.objData = data;
    cleanData();

    $scope.$apply();
  });
  socket.on('report confidence single', function (data){
    if ($scope.objData[data.objective_id]){
      $scope.objData[data.objective_id][data.socketId] = data.value;
    }else{
      var temp = {};
      temp[data.socketId] = data.value;
      $scope.objData[data.objective_id] = temp;
    }
    cleanData();

    $scope.$apply();
  });

  function cleanData(){
    $scope.data = _.mapObject($scope.objData, function(object, index){
      return _.values(object);
    })
    console.log($scope.data)
  }

  // $scope.data = [];
  // $scope.randomData = function(){
  //   var ary =[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30];
  //   console.log(ary);
  //   for(var i=0;i<4;i++){
  //     $scope.data[i] = ary.map(function(){
  //       return Math.random()*100;
  //     })
  //   }
  //   console.log($scope.data);
  // }

  //$scope.randomData();
});
