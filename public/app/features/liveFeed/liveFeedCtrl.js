angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc, $scope){


var socket = socketIoSrvc.getSocket();
//console.log(socket);

this.feed = [];

var self = this;
socket.on('liveFeed', function(data){
  console.log('12121212', data);
  self.feed.push(data);
    $scope.$apply();
})

socket.on('serversLiveFeedStore', function(data){
  // console.log('55555555', data);
  self.feed = data;
    $scope.$apply();
})





// $broadcast

});
