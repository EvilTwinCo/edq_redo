angular.module('theQ').directive('calendar', function() {
    return {
        templateUrl: 'app/views/calendar/calendarTmpl.html',
        controller: 'calendarCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
        
        }
    }
});