angular.module('theQ').directive('adminControls', function() {
    return {
        templateUrl: 'app/views/adminControls/adminControlsTmpl.html',
        controller: 'adminControlsCtrl',
        controllerAs: 'vm',
        bindToController: true,
        attribute: 'E',
        scope: {

        }
    }
});
