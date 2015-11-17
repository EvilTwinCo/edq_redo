angular.module('theQ').service('confidenceSrvc', function($q, $http) {
   
    //var baseUrl = 'http://192/'
    var baseUrl = 'http://localhost:8080/'
    
    this.getConfidences = function(cohortId) {
        var deferred = $q.defer();

        $http.get(baseUrl + 'admin/confidences/' + cohortId).then(function (res) {
            //console.log(res);
            deferred.resolve(res.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        })

        return deferred.promise;
    }
    
    this.getUserLearningObjConfidences = function(obj) {
        var deferred = $q.defer();

        $http.get(baseUrl + 'admin/confidences/user/' + obj.userId + '/' + obj.learningObjId).then(function (res) {
            //console.log(res);
            deferred.resolve(res.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        })

        return deferred.promise;
    }

});