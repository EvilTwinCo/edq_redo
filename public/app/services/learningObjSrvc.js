angular.module('theQ').service('learningObjSrvc', function($q, $http) {
    
    var baseURL = "http://"
    
    this.getLearningObjs = function() {
        var deferred = $q.defer();
        
        $http.get(baseURL + 'user/learningObj').then(function(res) {
            
            deferred.resolve(res.data);
        }, function(err) {
            
            deferred.reject(err);
        })
        
        return deferred.promise;
    }
    
});