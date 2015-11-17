angular.module('theQ').controller('liveFeedCtrl', function(socketIoSrvc, $scope, $element){

    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.feed = [];

    $scope.$watch('lF.cohortId', function() {
        console.log('watch cohortId seen');
        resetData();
    });

    socket.on('reset view data', resetViewData);
    socket.on('liveFeed', liveFeed);
    socket.on('server response: initial live feed queue', serverResponseInitialLiveFeedQueue);

    function resetViewData () {
        console.log(socket);
        console.log('resetting data view - liveFeed');
        resetData();
        $scope.$apply();
    }

    function liveFeed (data) {
        var existingQuestion = _.findWhere(self.feed,{timeQuestionAnswered:data.timeQuestionAnswered});
        if(existingQuestion){
            existingQuestion = _.extend(existingQuestion, data);
        }else{
            self.feed.unshift(data);
        }
        $scope.$apply();
    }

    function serverResponseInitialLiveFeedQueue (data) {
        data.reverse();
        self.feed = data;
        $scope.$apply();
    }

    function resetData () {
        console.log('client request: initial live feed queue', self.cohortId);
        socket.emit('client request: initial live feed queue', self.cohortId);
    }

    $element.on('$destroy', function() {
        socket.off('reset view data', resetViewData);
        socket.off('liveFeed', liveFeed);
        socket.off('server response: initial live feed queue', serverResponseInitialLiveFeedQueue);
    });
});
