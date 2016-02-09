angular.module('theQ').service('cohortSrvc', function($q, $http, $window) {

    this.getAllQuestions = function(){
      return $http.get('admin/questions?timeQuestionAnswered=null').then(function(res){
        return res.data;
      })
    }

    this.getCohortIds = function() {
        var deferred = $q.defer();
        $http.get('admin/cohorts').then(function (res) {
            //console.log(res.data);
            if (res.data.redirect) {
                $window.location.href = res.data.redirect;
                deferred.reject('not authorized');
            } else {
                res.data.sort(function(a,b) {return a-b;});
                deferred.resolve(res.data);
            }
        }, function (err) {
            console.log(err);
            deferred.reject(err);
        });

        return deferred.promise;
    };
});
