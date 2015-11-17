angular.module('theQ').service('cohortSrvc', function($q, $http) {

    //var baseUrl = 'http://192/'
    var baseUrl = 'http://localhost:8080/'

    this.getCohortIds = function() {
        var deferred = $q.defer();
        $http.get(baseUrl + 'admin/cohorts').then(function (res) {
            //console.log(res.data);
            res.data.sort(function(a,b) {return a-b});
            deferred.resolve(res.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        })

        return deferred.promise;
    }
});