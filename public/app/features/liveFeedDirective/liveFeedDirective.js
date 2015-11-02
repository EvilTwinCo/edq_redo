var App = angular.module('theQ').directive('liveFeedDirective', function(){

//props will be the array witn all the 'feeds'
// in html camel case gets changed into dashes for names in the html
  return {

    templateUrl:"./features/liveFeedDirective/liveFeed.html",
    controller: 'liveFeedCtrl',
    controllerAs: 'lF',
    bindToController: true,
    attribute: 'E',
    scope: {
      props: '='

    }
  }



});
