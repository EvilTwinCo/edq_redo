angular.module('theQ').directive('login', function() {
    return {
        templateUrl: 'app/views/login/loginTmpl.html',
        controller: 'loginCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope: {
        
        }
    }
});