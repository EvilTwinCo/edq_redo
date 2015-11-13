var app = angular.module("theQ").controller("queueStatsChartCtrl", function ($scope, socketIoSrvc) {
  var socket = socketIoSrvc.getSocket();

  console.log(self);
  socket.emit('request queue stats');

  socket.on('report queue stat data', function(queueData){
    console.log("Test");
    $scope.queueData = queueData;
    
    $scope.$apply();

  });
})
