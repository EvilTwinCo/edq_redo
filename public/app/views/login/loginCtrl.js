angular.module('theQ').controller('loginCtrl', function($q, $scope, $http, $window) {

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

//
// 
//     this.loginWithPassportDevMtn = function() {
//
//         $window.location.href = 'http://localhost:8080/auth/devmtn';
//
//         /*
//         var deferred = $q.defer();
//
//         $http.get('http://localhost:8080/auth/devmtn').then(function(res) {
//             deferred.resolve(res);
//         }, function (err) {
//             deferred.reject('PassportDevMtn login error')
//         })
//
//         return deferred.promise;*/
//     }
//
//     this.loginWithPassportDevMtn();

  $scope.showAttendance = function() {
    console.log(document.getElementById('attendance-button'))
    document.getElementById('attendance-button').className += 'active';
  };

});
