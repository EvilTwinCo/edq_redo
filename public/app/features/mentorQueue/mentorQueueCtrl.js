angular.module('theQ').controller('mentorQueueCtrl', function (socketIoSrvc, $scope, $element) {
    var socket = socketIoSrvc.getSocket();
    var self = this;

    $scope.$watch('mq.cohortId', function() {
        resetData();
    });

    socket.on('getAllQuestionsAsked', getAllQuestionsAsked);
    socket.on('reset view data', resetViewData)
    socket.on('questionForQueue', questionForQueue);
    socket.on('remove question from queue', removeQuestionFromQueue);
    socket.on('mentorBegins', mentorBegins);

    function questionForQueue (data) {
      if( data.cohortId === self.cohortId){
        self.questions.push(data);
        updateTitle();
        $scope.$apply();
      }
    };

    function getAllQuestionsAsked (data) {
        self.questions = data;
        updateTitle();
        $scope.$apply();
    }

    function updateTitle(){
      var activeQuestions = self.questions.reduce(function(prev,cur){
        if(!cur.mentorName){
          return prev+1;
        }
        return prev;
      },0)
      if(activeQuestions>0){
          document.title = "("+activeQuestions+") Questions";
      }else{
        document.title = "Queue Clear!";
      }
    }

    function resetViewData () {
        resetData();
        updateTitle();
        $scope.$apply();
    }

    function removeQuestionFromQueue (question) {
        self.questions = _.filter(self.questions, function (item) {
            return item.studentId !== question.studentId;
        });
        updateTitle();
        $scope.$apply();
    };

    function mentorBegins (updatedQuestion) {
        _.findWhere(self.questions, {studentId:updatedQuestion.studentId}).mentorName  = updatedQuestion.mentorName;
        updateTitle();
        $scope.$apply();
    };

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
        socket.off('questionForQueue', questionForQueue);
        socket.off('remove question from queue', removeQuestionFromQueue);
        socket.off('mentorBegins', mentorBegins);
    })

    this.initSelect = function(){
      $('select').material_select();
    };

});
