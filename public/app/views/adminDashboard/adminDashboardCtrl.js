angular.module('theQ').controller('adminDashboardCtrl', function (socketIoSrvc) {
    var socket = socketIoSrvc.getSocket();

    this.currentCohort = "Select ID...";
    
    this.cohortOptions = [
        {
            label: "26",
            value: "26"
        },
        {
            label: "27",
            value: "27"
        },
        {
            label: "28",
            value: "28"
        }
    ]
    
    this.setDropdownValue = function (cohort) {
        this.currentCohort = cohort.value;
        //console.log(this.currentCohort);
        socket.emit('request reset view data');
    }

    socket.emit('instructor login');
});