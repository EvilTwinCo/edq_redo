angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc){


var socket = socketIoSrvc.getSocket();
console.log(socket);

this.feed = [];

var self = this;
socket.on('liveFeed', function(data){
  console.log('12121212', data);
  self.feed.push(data);
})

socket.on('serversLiveFeedStore', function(data){
  self.feed = data;
})





// $broadcast

});
