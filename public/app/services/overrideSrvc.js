angular.module('theQ').service('overrideSrvc', function($http) {

    this.getAll = function() {
        return $http.get('/admin/overrides').then(function(result) {
            //console.log(result);

            result.data.sort(function(a,b) {
                var minWordLength;
                if (a.studentEmail.length < b.studentEmail.length) {
                    minWordLength = a.studentEmail.length;
                } else {
                    minWordLength = b.studentEmail.length;
                }
                for (var i = 0; i < minWordLength; i++) {
                    aCodePoint = a.studentEmail.codePointAt(i);
                    bCodePoint = b.studentEmail.codePointAt(i);
                    if (aCodePoint !== bCodePoint) {
                        return aCodePoint - bCodePoint;
                    }
                }
                return 0;
            });

            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.getOne = function(id) {
        return $http.get('/admin/overrides/' + id).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.create = function(obj) {
        return $http.post('/admin/overrides', obj).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.update = function(id, obj) {
        return $http.put('/admin/overrides/' + id, obj).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.deleteObj = function(id) {
        return $http.delete('/admin/overrides/' + id).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }
});
