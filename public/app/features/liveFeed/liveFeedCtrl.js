angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc, $scope){

    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.feed = [];
    
    console.log(socket);

    $scope.$watch('lF.cohortId', function() {
        console.log('watch cohortId seen');
        resetData();
    })
    
    console.log(socket._callbacks['reset view data']);
    if (socket._callbacks['reset view data'] === undefined) {
        socket.on('reset view data', function () {
            console.log(socket);
            console.log('resetting data view - liveFeed');
            resetData();
            $scope.$apply();
        })
    }
    
    socket.on('liveFeed', function(data){
      
        console.log('liveFeed', data);
        self.feed.unshift(data);
        $scope.$apply();
    })

//    socket.on('serversLiveFeedStore', function(data){
//      self.feed = data;
//        $scope.$apply();
//    })

    socket.on('server response: initial live feed queue', function(data) {
        data.reverse();
        console.log('server response: initial live feed queue: reversed:', data);
        self.feed = data;
        $scope.$apply();
        console.log('============');
    })
    
    function resetData () {
        console.log('client request: initial live feed queue', self.cohortId)
        socket.emit('client request: initial live feed queue', self.cohortId); 
    }
    
});
