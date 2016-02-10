angular.module('theQ').controller('adminControlsCtrl', function (socketIoSrvc, cohortSrvc, $scope, aliasSrvc, overrideSrvc) {
    var socket = socketIoSrvc.getSocket();
    var self = this;

    aliasSrvc.getAll().then(function(result) {
        //console.log(result);
        self.cohortAliases = result;
    }, function(error) {
        //console.log(error);
    });

    overrideSrvc.getAll().then(function(result) {
        //console.log(result);
        self.cohortIdOverrides = result;
    }, function(error) {
        //console.log(error);
    });

    this.addCohortAlias = function () {
        self.cohortAliases.push({cohortId: "", alias: ""});
    }

    this.updateCohortAlias = function (i) {
        var id = self.cohortAliases[i]._id;
        if (id) {
            //console.log('updating ' + i);
            aliasSrvc.update(id, self.cohortAliases[i]).then(function(result) {
                //console.log(result);
            }, function(error) {
                console.log(error);
            })
        } else {
            //console.log('creating ' + i);
            aliasSrvc.create(self.cohortAliases[i]).then(function(result) {
                //console.log(result);
            }, function(error) {
                console.log(error);
            })
        }
    }

    this.deleteCohortAlias = function (i) {
        //console.log('deleting ' + i);
        if(confirm('Do you really want to delete the cohort alias for ' + self.cohortAliases[i].cohortId)) {
            var id = self.cohortAliases[i]._id;
            if (id) {
                aliasSrvc.deleteObj(id).then(function(result) {
                    //console.log(result);
                    self.cohortAliases.splice(i, 1);
                }, function(error) {
                    console.log(error);
                })
            } else {
                self.cohortAliases.splice(i, 1);
            }
        }
    }

    this.addCohortIdOverride = function () {
        self.cohortIdOverrides.push({studentEmail: "", cohortIdOverride: ""});
    }

    this.updateCohortIdOverride = function (i) {
        var id = self.cohortIdOverrides[i]._id;
        if (id) {
            //console.log('updating ' + i);
            overrideSrvc.update(id, self.cohortIdOverrides[i]).then(function(result) {
                //console.log(result);
            }, function(error) {
                console.log(error);
            })
        } else {
            //console.log('creating ' + i);
            overrideSrvc.create(self.cohortIdOverrides[i]).then(function(result) {
                //console.log(result);
            }, function(error) {
                console.log(error);
            })
        }
    }

    this.deleteCohortIdOverride = function (i) {
        //console.log('deleting ' + i);
        if(confirm('Do you really want to delete the cohort ID override for ' + self.cohortIdOverrides[i].studentEmail)) {
            var id = self.cohortIdOverrides[i]._id;
            if (id) {
                overrideSrvc.deleteObj(id).then(function(result) {
                    //console.log(result);
                    self.cohortIdOverrides.splice(i, 1);
                }, function(error) {
                    console.log(error);
                })
            } else {
                self.cohortIdOverrides.splice(i, 1);
            }
        }
    }
});
