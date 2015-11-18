var app = angular.module("theQ").directive("loginPage", function(){

return {

  templateUrl: 'app/views/loginPage/loginPage.html',
  controller: "loginPageCtrl",
  controllerAs: "is",
  bindToController: true,
  scope: {
  },

  attribute: "E"

};


});
