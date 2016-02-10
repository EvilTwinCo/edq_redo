angular.module('theQ').service('aliasSrvc', function($http) {

    this.getAll = function() {
        return $http.get('/admin/aliases').then(function(result) {
            //console.log(result);

            result.data.sort(function(a,b) {
                if (!isNaN(Number(a.cohortId)) && !isNaN(Number(b.cohortId))) {
                    return a.cohortId - b.cohortId;
                } else {
                    var minWordLength;
                    if (a.cohortId.length < b.cohortId.length) {
                        minWordLength = a.cohortId.length;
                    } else {
                        minWordLength = b.cohortId.length;
                    }
                    for (var i = 0; i < minWordLength; i++) {
                        aCodePoint = a.cohortId.codePointAt(i);
                        bCodePoint = b.cohortId.codePointAt(i);
                        if (aCodePoint !== bCodePoint) {
                            return aCodePoint - bCodePoint;
                        }
                    }
                    return 0;
                }
            });

            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.getOne = function(id) {
        return $http.get('/admin/aliases/' + id).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.create = function(obj) {
        return $http.post('/admin/aliases', obj).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.update = function(id, obj) {
        return $http.put('/admin/aliases/' + id, obj).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

    this.deleteObj = function(id) {
        return $http.delete('/admin/aliases/' + id).then(function(result) {
            //console.log(result);
            return result.data;
        }, function (error) {
            console.log(error);
            return error;
        })
    }

});
