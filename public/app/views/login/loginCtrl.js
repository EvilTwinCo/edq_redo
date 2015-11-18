angular.module('theQ').controller('loginCtrl', function($q, $http, $window, $location, socketIoSrvc) {

    this.go = function() {
        var deferred = $q.defer();

        $http.post('/auth/passportLocal', {username: this.user, password: 'any'}).then(function(res) {
            socketIoSrvc.connectSocket();
            $location.path('/studentDashboard');
        }, function (err) {
            console.log(err);
        });
    };

   this.loginWithPassportDevMtn = function() {
        $window.location.path = '/auth/devmtn';
   };

   this.loginWithPassportDevMtn();
});
