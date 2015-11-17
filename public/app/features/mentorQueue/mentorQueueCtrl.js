angular.module('theQ').controller('mentorQueueCtrl', function (socketIoSrvc, $scope, $element) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    
    $scope.$watch('mq.cohortId', function() {
        console.log('watch cohortId seen');
        resetData();
        //$scope.$apply();
    });

    socket.on('getAllQuestionsAsked', getAllQuestionsAsked);
    socket.on('reset view data', resetViewData)

    socket.on('questionForQueue', function (data) {
      if( data.cohortId === self.cohortId){
        self.questions.push(data);
        $scope.$apply();
      }
    });

    function getAllQuestionsAsked (data) {
        self.questions = data;
        $scope.$apply();
    }
    
    function resetViewData () {
        console.log(socket);
        console.log('resetting data view - liveFeed');
        resetData();
        $scope.$apply();
    }

    socket.on('remove question from queue', function (question) {
        self.questions = _.filter(self.questions, function (item) {
            return item.studentId !== question.studentId;
        });
        $scope.$apply();
    });

    socket.on('mentorBegins', function(updatedQuestion){
      console.log('mentor identify',updatedQuestion);
      console.log('1',_.findWhere(self.questions, {studentId:updatedQuestion.studentId}));
      _.findWhere(self.questions, {studentId:updatedQuestion.studentId}).mentorName  = updatedQuestion.mentorName;
      $scope.$apply();
      console.log('2',_.findWhere(self.questions, {studentId:updatedQuestion.studentId}));
    });

    this.ObjectEntersQ = function (object) {
        object.timeWhenEnteredQ = new Date();
    };

    this.mentorBegins = function (object) {
        object.timeMentorBegins = new Date();
        socket.emit('mentor begins', object);
    };

    this.questionResolve = function (object) {
        object.timeQuestionAnswered = new Date();
        object.removing = true;
        socket.emit('mentor resolves question', object);
    };

    this.addingQuestionAndSolution = function (object, share) {
        if (share){
          socket.emit("mentor post: live feed", object);
        }
        socket.emit('add mentor notes', object);
        socket.emit('request question removal', object);
    };

    function resetData() {
        self.questions = [];
        socket.emit('get questions asked', {cohortId: self.cohortId});
    }
    
    $element.on('$destroy', function() {
        socket.off('getAllQuestionsAsked', getAllQuestionsAsked);
        socket.off('reset view data', resetViewData);
    })

    this.initSelect = function(){
      $('select').material_select();
    };

});

