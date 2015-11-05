angular.module('theQ').controller('loginCtrl', function($q, $http, $window) {

<<<<<<< HEAD
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


=======
    this.loginWithPassportDevMtn = function() {

        $window.location.href = 'http://localhost:8080/auth/devmtn'; 
        
        /*
        var deferred = $q.defer();
        
        $http.get('http://localhost:8080/auth/devmtn').then(function(res) {
            deferred.resolve(res);
        }, function (err) {
            deferred.reject('PassportDevMtn login error')
        })
        
        return deferred.promise;*/
    }
  
    this.loginWithPassportDevMtn();
>>>>>>> 6b9596d22d9dd67d6c3f3fb1010f69f7dd38761c
});
