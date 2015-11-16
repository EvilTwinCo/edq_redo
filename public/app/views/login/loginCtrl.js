angular.module('theQ').controller('loginCtrl', function($q, $http, $window, $location) {

    this.go = function() {
        console.log('here')
        var deferred = $q.defer();
        
        $http.post('/auth/passportLocal', {username: this.user, password: 'any'}).then(function(res) {
            $location.path('/studentDashboard');
        }, function (err) {
            console.log(err);
        })
    }
    
   this.loginWithPassportDevMtn = function() {
        $window.location.href = 'http://localhost:8080/auth/devmtn';
   }

   this.loginWithPassportDevMtn();
});
