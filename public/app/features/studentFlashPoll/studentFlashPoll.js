angular.module('theQ').directive('studentFlashPoll', function(){
    return {
        templateUrl: 'app/features/studentFlashPoll/studentFlashPollTmpl.html',
        controller: 'studentFlashPollCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});