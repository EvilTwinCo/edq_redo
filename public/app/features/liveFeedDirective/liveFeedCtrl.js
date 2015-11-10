angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc){


var socket = socketIoSrvc.getSocket();
console.log(socket);

this.feed = [];

socket.on('liveFeed', function(data){
  console.log(data);
  this.feed.push(data);
})

socket.on('serversLiveFeedStore', function(data){
  this.feed = data;
})


// $broadcast

});
