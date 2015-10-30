var App = angular.module('theQ').directive('liveFeed', function(){

//props will be the array witn all the 'feeds'
  return {
    templateUrl:"./liveFeed.html",
    controller: 'liveFeedCtrl',
    controllerAs: 'lF',
    bindToController: 'true',
    attribute: 'E',
    scope: {
      props: '='
    }

  }



})
