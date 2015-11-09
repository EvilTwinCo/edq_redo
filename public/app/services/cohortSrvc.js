angular.module('theQ').service('cohortSrvc', function($q, $http) {
   
    var baseUrl = 'http://localhost:8000/'
    
    this.getCohortIds = function() {
        var deferred = $q.defer();
        
        $http.get(baseUrl + 'cohorts').then(function (res) {
            console.log(res);
            deferred.resolve(res.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        })
        
        return deferred.promise;
    }
});