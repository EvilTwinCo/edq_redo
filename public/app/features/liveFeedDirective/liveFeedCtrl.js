angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc){


var socket = socketIoSrvc.getSocket();

this.feed = [];

socket.on('liveFeed', function(data){
  this.feed.push(data);
})

socket.on('serversLiveFeedStore', function(data){
  this.feed = data;
})


// $broadcast

});
