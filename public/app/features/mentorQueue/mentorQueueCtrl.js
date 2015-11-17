angular.module('theQ').controller('mentorQueueCtrl', function (socketIoSrvc, $scope) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    resetData();

    socket.on('reset view data', function () {
        //console.log('resetting data view - queue');
        resetData();
        $scope.$apply();
    });

    socket.on('questionForQueue', function (data) {
      console.log(data);
        console.log(data.cohortId);
        console.log(self.cohortId);
      if( data.cohortId === self.cohortId){
        self.questions.push(data);
        $scope.$apply();
      }
    });

    socket.on('getAllQuestionsAsked', function (data) {
        self.questions = data;
        $scope.$apply();
    });

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
        //need mentor name
        //object.mentorName = "Smelly guy"
        console.log(object);
        socket.emit('mentor begins', object);
    };

    this.questionResolve = function (object) {
        object.timeQuestionAnswered = new Date();
        object.removing = true;
        socket.emit('mentor resolves question', object);
    };

    this.addingQuestionAndSolution = function (object, share) {
      console.log("Resovle Mentor Solution");
        if (share){
          console.log("Should Share");
          socket.emit("mentor post: live feed", object);
        }
        socket.emit('add mentor notes', object);
        socket.emit('request question removal', object);
    };

    function resetData() {
        self.questions = [];
        socket.emit('get questions asked', {cohortId: self.cohortId});
    }

    this.initSelect = function(){
      console.log("Init Select");
      $('select').material_select();
      console.log($('select'));
    };
});
