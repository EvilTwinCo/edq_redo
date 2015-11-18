angular.module('theQ').service('attendanceSrvc', function($q, $http) {

    this.getRecordedAttendanceForToday = function (cohortId) {        
        var deferred = $q.defer();
        var today = new Date(new Date().setHours(0,0,0,0));
        console.log(today);
        
        $http.get('/admin/attendances/' + today + '/' + cohortId).then(function(res){
            console.log(res.data);
            deferred.resolve(res.data);
        }, function(err) {
            console.log(err);
            deferred.reject(res.data);
        })
        
        return deferred.promise;
    }
});