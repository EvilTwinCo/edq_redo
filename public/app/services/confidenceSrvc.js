angular.module('theQ').service('confidenceSrvc', function($q, $http) {

    this.getConfidences = function(cohortId) {
        var deferred = $q.defer();

        $http.get('/admin/confidences/' + cohortId).then(function (res) {
            deferred.resolve(res.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

    this.getUserLearningObjConfidences = function(obj) {
        var deferred = $q.defer();

        $http.get('admin/confidences/user/' + obj.userId + '/' + obj.learningObjId).then(function (res) {
            deferred.resolve(res.data);
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        });

        return deferred.promise;
    };

});
