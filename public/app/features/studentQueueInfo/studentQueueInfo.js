angular.module('theQ').directive('studentQueueInfo', function(){

  return {

    templateUrl: "./app/features/studentQueueInfo/studentQueueInfo.html",
    controller: "studentQueueInfoCtrl",
    controllerAs: 'qi',
    bindToController: true,
    attribue: "E",
    scope: {
      props: '='
    }

  }


})
