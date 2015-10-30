angular.module('theQ').directive('dayNotes', function() {
    return {
        templateUrl: 'app/features/dayNotes/dayNotesTmpl.html',
        controller: 'dayNotesCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
        
        }
    }
});