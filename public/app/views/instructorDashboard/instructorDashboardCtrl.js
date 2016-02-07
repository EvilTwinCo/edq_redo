angular.module('theQ').controller('instructorDashboardCtrl', function (socketIoSrvc, cohortSrvc) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.currentCohort = "Select ID...";
    this.cohortOptions = ["Please wait..."];

    cohortSrvc.getCohortIds().then(function(res) {
        //console.log(res);
        self.cohortOptions = res;
    }, function(err) {
        console.log(err);
    });

    this.setDropdownValue = function (cohort) {
        this.currentCohort = cohort;
        //console.log(this.currentCohort);
        socket.emit('request reset view data');
    }
});
