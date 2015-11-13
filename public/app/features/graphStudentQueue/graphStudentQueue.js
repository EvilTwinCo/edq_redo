 angular.module('theQ').directive('graphStudentQueue', function() {
    return {
        templateUrl: 'app/features/graphStudentQueue/graphStudentQueueTmpl.html',
        controller: 'graphStudentQueueCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
          chartData:"="
        }
    };
});
