var App = angular.module('theQ').directive('liveFeed', function(){

//props will be the array witn all the 'feeds'
// in html camel case gets changed into dashes for names in the html
  return {

    templateUrl:"app/features/liveFeed/liveFeedTmpl.html",
    controller: 'liveFeedCtrl',
    controllerAs: 'lF',
    bindToController: true,
    attribute: 'E',
    scope: {
        props: '=',
        cohortId: '='

    }
  }



});
