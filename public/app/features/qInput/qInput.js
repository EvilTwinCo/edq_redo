angular.module('theQ').directive('qInput', function(){
    return {
      templateUrl: 'app/features/qInput/qInputTmpl.html',
      controller: 'qInputCtrl',
      controllerAs: 'is',
      bindToController: true,
      attribute: 'E',
      scope:{

      }
    }

});
