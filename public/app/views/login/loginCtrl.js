angular.module('theQ').controller('loginCtrl', function($q, $http) {

  this.loginWithPassportDevMtn = function() {
     var deferred = $q.defer();
     $http.get('http://localhost:8080/auth/devmtn').then(function(res) {
         deferred.resolve(res);
     }, function (err) {
         deferred.reject('PassportDevMtn login error')
     })
     return deferred.promise;
 }
  this.loginWithPassportDevMtn();


});
