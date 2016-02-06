angular.module('theQ').controller('adminDashboardCtrl', function (socketIoSrvc, cohortSrvc) {
    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.currentCohort = "Select ID...";
    this.cohortOptions = ["Please wait..."];

    cohortSrvc.getCohortIds().then(function(res) {
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
