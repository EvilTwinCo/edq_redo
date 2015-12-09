angular.module('theQ').controller('attendanceTrackerCtrl', function (socketIoSrvc, $scope, $element, attendanceSrvc) {
    
    var socket = socketIoSrvc.getSocket();
    var self = this;
    this.hideMenu = true;
    this.tempUser = {};
    this.users = [];

    $scope.$watch('self.users', function (newValue, oldValue) {

    });

    socket.on('attendanceUpdateWithNewAttenance', attendanceUpdateWithNewAttenance);
    //socket.on('getInitialAttendance', getInitialAttendance);

    this.doIt = function () {
        $('select').material_select();
    }

    this.setTimeToNineAm = function () {
        var today = function () {
            return new Date();
        }
        var nineOclock = new Date();
        return new Date(nineOclock.setHours(9, 0, 0));
    }

    /*this.getTheUsersForCohort = function () {
        socket.emit('getAttendance', self.cohortId);
    }*/

    this.toggleDisplay = function () {
        this.hideMenu = !this.hideMenu;
        if (!this.hideMenu) {
            //this.getTheUsersForCohort();
            getAttendanceData();
        }
    }

    this.getDateObject = function () {
        return new Date();
    }

    this.timeInButton = function (user) {
        user.attendanceData.timeIn = self.setTimeToNineAm();
        self.formatAndPostAttendance(user);
    }

    this.startChangeTimeIn = function (user) {
        self.tempUser = user;
    }

    this.setNewTimeIn = function (time) {
        var hours = time.getHours();
        var mins = time.getMinutes();
        var seconds = time.getSeconds();
        var now = new Date();
        now.setHours(hours, mins, seconds);
        self.tempUser.attendanceData.timeIn = now;
        self.formatAndPostAttendance(self.tempUser);
    }

    this.startChangeTimeOut = function (user) {
        self.tempUser = user;
    }

    this.setNewTimeOut = function (time) {
        var hours = time.getHours();
        var mins = time.getMinutes();
        var seconds = time.getSeconds();
        var now = new Date();
        now.setHours(hours, mins, seconds);
        self.tempUser.attendanceData.timeOut = now;
        self.formatAndPostAttendance(self.tempUser);
    }

    this.timeOutButton = function (user) {
        user.attendanceData.timeOut = self.getDateObject();
        self.formatAndPostAttendance(user);
    }

    this.changeScore = function (user, e) {
        self.formatAndPostAttendance(user);
    }

    this.dateForCheckingAttendanceDate = function () {
        var today = function () {
            return new Date();
        }
        var zeroOclock = new Date(new Date().setHours(0, 0, 0, 0));
        console.log('zeroOclock', zeroOclock);
        return zeroOclock;
    }

    this.formatAndPostAttendance = function (user) {
        var today = self.dateForCheckingAttendanceDate();
        user.todayDate = today;
        user.cohortId = self.cohortId;

        if (typeof user.attendanceData.score == 'string') {
            switch (user.attendanceData.score) {
            case ('number:1'):
                user.attendanceData.score = 1;
                break;
            case ('number:2'):
                user.attendanceData.score = 2;
                break;
            case ('number:3'):
                user.attendanceData.score = 3;
                break;
            }
        }
        console.log(user);
        socket.emit("postAttendance", user);
    }

    function attendanceUpdateWithNewAttenance(data) {
        self.users.forEach(function (item, index, arr) {
            if (item._id == data.user) {
                item.attendanceData = data.attendanceData;
            }
        })
    }

    /*function getInitialAttendance(freshUsers) {
        self.users = [];
        var today = self.dateForCheckingAttendanceDate();
        freshUsers.forEach(function (item, index, array) {
            if (item.cohortId == self.cohortId) {

                if (!item.attendanceData) {
                    item.attendanceData = {
                        timeIn: null,
                        timeOut: null,
                        score: null,
                        dateOfAttendance: today
                    };
                    self.users.push(item);

                } else {

                    self.users.push(item);
                }
            }
        })
        $scope.$apply();
    }*/
    
    function getAttendanceData() {
       attendanceSrvc.getRecordedAttendanceForToday(self.cohortId).then(function(res) {
           console.log(res);
           self.users = res.map(function(item) {
               item.firstName = item.user.firstName;
               item.lastName = item.user.lastName;
               return item;
           })
       }, function (err) {
           console.log(err);
       }) 
    }

    $element.on('$destroy', function () {
        socket.off('attendanceUpdateWithNewAttenance', attendanceUpdateWithNewAttenance);
        socket.off('getInitialAttendance', getInitialAttendance);
    })

});