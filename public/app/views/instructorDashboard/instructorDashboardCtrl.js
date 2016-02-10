angular.module('theQ').controller('instructorDashboardCtrl', function (socketIoSrvc, cohortSrvc, aliasSrvc) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.currentCohort = "Select ID...";
    this.currentCohortAlias = "Select ID...";
    this.cohortOptions = ["Please wait..."];

    cohortSrvc.getCohortIds().then(function(ids) {
        //console.log(res);
        self.cohortOptions = ids;
        self.cohortAliases = ids.slice(0);
        aliasSrvc.getAll().then(function(aliases) {

            if (aliases.length !== 0) {
                var aliasIds = _.pluck(aliases, 'cohortId');

                aliases.forEach(function(item) {
                    var matchIndex = self.cohortOptions.indexOf(item.cohortId);
                    if (matchIndex !== -1) {
                        self.cohortAliases[matchIndex] = item.alias;
                    }
                })
            }
        }, function(err2) {
            console.log(err2)
        })
    }, function(err) {
        console.log(err);
    });

    this.setDropdownValue = function (cohort, index) {
        this.currentCohort = cohort;
        this.currentCohortAlias = this.cohortAliases[index];
        //console.log(this.currentCohort);
        socket.emit('request reset view data');
    }
});
