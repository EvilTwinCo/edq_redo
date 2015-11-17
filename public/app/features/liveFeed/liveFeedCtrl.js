angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc, $scope){

    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.feed = [];
    resetData();

    socket.on('reset view data', function () {
        console.log('resetting data view - liveFeed');
        resetData();
        $scope.$apply();
    });

    socket.on('liveFeed', function(data){
      var existingQuestion = _.findWhere(self.feed,{timeQuestionAnswered:data.timeQuestionAnswered});
      console.log(self.feed);
      console.log(existingQuestion);
      if(existingQuestion){
        console.log("Extend Solution");
          existingQuestion = _.extend(existingQuestion, data);
      }else{
        console.log("Push New Solution");
        self.feed.push(data);
      }
      $scope.$apply();
    });

    socket.on('serversLiveFeedStore', function(data){
      self.feed = data;
        $scope.$apply();
    });

    socket.on('server response: initial live feed queue', function(data) {

        self.feed = data;
        $scope.$apply();
    });

    function resetData () {
        socket.emit('client request: initial live feed queue', self.cohortId);
    }

});
