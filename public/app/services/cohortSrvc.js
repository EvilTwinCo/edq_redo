angular.module('theQ').service('cohortSrvc', function($q, $http) {

    //var baseUrl = 'http://192.168.1.100:8080/'
    var baseUrl = 'http://localhost:8080/'

    this.getCohortIds = function() {
        var deferred = $q.defer();
        //console.log('I am an idiot');
        $http.get(baseUrl + 'admin/cohorts').then(function (res) {
            console.log(res.data);
            res.data.sort(function(a,b) {return a-b});
            deferred.resolve(res.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        })

        return deferred.promise;
    }
});