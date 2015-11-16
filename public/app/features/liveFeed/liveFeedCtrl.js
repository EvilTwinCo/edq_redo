angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc, $scope){

    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.feed = [];
    resetData();

    socket.on('reset view data', function () {
        console.log('resetting data view - liveFeed');
        resetData();
        $scope.$apply();
    })
    
    socket.on('liveFeed', function(data){
      self.feed.push(data);
        $scope.$apply();
    })

    socket.on('serversLiveFeedStore', function(data){
      self.feed = data;
        $scope.$apply();
    })

    socket.on('server response: initial live feed queue', function(data) {
        console.log(data);
        self.feed = data;
        $scope.$apply();
    })
    
    function resetData () {
        console.log(self.cohortId)
        socket.emit('client request: initial live feed queue', self.cohortId); 
    }

});
