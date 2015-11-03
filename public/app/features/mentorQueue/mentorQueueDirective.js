angular.module('theQ').directive('mentorQueue', function(){

  return{

    templateUrl: "./app/features/mentorQueue/mentorQueue.html",
    controller: "mentorQueueCtrl",
    controllerAs: "mq",
    bindToController: true,
    attribue: 'E',
    scope: {
      props: '='
      }

    }

})
