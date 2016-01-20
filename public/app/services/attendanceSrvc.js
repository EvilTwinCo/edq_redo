angular.module('theQ').service('attendanceSrvc', function($q, $http) {

    this.getRecordedAttendanceForToday = function (cohortId) {
        var deferred = $q.defer();
        var today = new Date(new Date().setHours(0,0,0,0));
        
        $http.get('/admin/attendances/' + today + '/' + cohortId).then(function(res){
            deferred.resolve(res.data);
        }, function(err) {
            console.log(err);
            deferred.reject(res.data);
        })

        return deferred.promise;
    }
});
