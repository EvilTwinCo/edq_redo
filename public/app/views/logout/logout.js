angular.module('theQ').directive('logout', function() {
    return {
        templateUrl: 'app/views/logout/logoutTmpl.html',
        controller: 'logoutCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
        
        }
    }
});