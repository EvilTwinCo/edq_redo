angular.module('theQ').directive('menuBar', function(){
    return {
        templateUrl: 'app/features/menuBar/menuBarTmpl.html',
        controller: 'menuBarCtrl',
        controllerAs: 'is',
        bindToController: true,
        attribute: 'E',
        scope:{
            
        }
    }
});