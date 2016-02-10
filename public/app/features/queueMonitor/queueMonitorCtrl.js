angular.module('theQ').controller('queueMonitorCtrl', function (socketIoSrvc, cohortSrvc, $scope, $interval) {

    //this.question = this.question;
    var day = [];
    var socket = socketIoSrvc.getSocket();

    var self = this;
    self.questionsByCohort = {};
    self.statsByCohort = {};

    getQuestions();
    $interval(getQuestions, 10000);

    function getQuestions(){
        cohortSrvc.getAllQuestions().then(function(result){
          console.log(result);
          self.questionsByCohort = _.groupBy(result, function(item){
            return item.cohortId;
          })
          calcStats();
        })
    }


    socket.on('getAllQuestionsAsked', function(questions){
      if(questions.length){

        var cohortId = questions[0].cohortId
        self.questionsByCohort[cohortId] = questions;
        calcStats();
        $scope.$apply();

      }
    });

  function calcStats(){
    self.statsByCohort = _.map(self.questionsByCohort, function(item){
      if (item){
        var statsObj = {studentsBeingHelped:0
          , studentsInQueue:0
          , waitTimes:[]
          , avgWaitTimeInQueue:0
          , cohortId:item[0].cohortId}
          statsObj = item.reduce(function(prev, cur){
            if (cur.timeMentorBegins){
              prev.studentsBeingHelped++;
            }else{
              prev.studentsInQueue++;
              prev.waitTimes.push((new Date() - new Date(cur.timeWhenEntered))/1000/60)
            }
            return prev;
          }, statsObj);
          if (statsObj.studentsInQueue){
            statsObj.avgWaitTimeInQueue = statsObj.waitTimes.reduce(function(memo, num){ return memo + num; }, 0)/statsObj.waitTimes.length;
          }
          return statsObj;
      }
    })
  }


});