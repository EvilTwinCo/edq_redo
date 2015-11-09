angular.module('theQ').directive('studentQuestionForm', function(){
    return {
        templateUrl: 'app/features/studentQuestionForm/studentQuestionFormTmpl.html',
        controller: 'studentQuestionFormCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
            objectives:"="
        }
    }
});
