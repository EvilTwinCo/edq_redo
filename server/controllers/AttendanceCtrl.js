var Attendance = require('../models/Attendance');
var mongoose = require('mongoose');
var User = require('../models/User');
var _ = require('underscore');

module.exports = {
    getAllAttendanceOfCohort: function (socket, data) {
        var cohortAttendance = [];
        //console.log(data);
        if (data == "all") {
            User.find({}).exec(function (err, users) {
                users.forEach(function (item) {
                    Attendance.find({
                        'user': item._id
                    }).exec(function (error, attendance) {
                        var userWithAttendance = {
                            attendee: item,
                            attendance: attendance
                        };
                        socket.emit('All attendance for a cohort', userWithAttendance);
                    });
                });
            });
        } else {
            User.find({}).where('devMtn.cohortId').equals(data).exec(function (err, users) {
                users.forEach(function (item) {
                    Attendance.find({
                        'user': item._id
                    }).exec(function (error, attendance) {
                        var userWithAttendance = {
                            attendee: item,
                            attendance: attendance
                        };
                        socket.emit('All attendance for a cohort', userWithAttendance);
                    });
                });
            });
        }
    },
    postAttendance: function (socket, data) {


        Attendance.findOne({
            'user': data.user,
            'attendanceData.dateOfAttendance': {
                $gte: data.todayDate
            }
        }, function (err, attendance) {
            if (attendance) {
                attendance.attendanceData = data.attendanceData;
                attendance.save(function (err) {
                    if (err) {
                        console.log(err);
                    }
                    //console.log('Saving attendance', attendance);
                    socket.emit('attendanceUpdate', attendance);
                });
            } else {
                //console.log(data);
                new Attendance(data).save(function (error, data) {
                    if (error) {
                        console.log(error);
                    } else {
                        //console.log("New attendance record from server", data);
                        socket.emit("attendanceUpdateWithNewAttenance", data);
                    }
                });
            }
        });
    },
    getAttendance: function (socket, data) {
        var today = function () {
            return new Date();
        }
        var morning = today();
        morning.setHours(0, 0, 0, 0);
        User.find({}).exec(function (err, users) {
            Attendance.find({})
                .where('attendanceData.dateOfAttendance')
                .gt(morning)
                .exec(function (err, attendances) {
                    var daysAttendance = users.map(function (item) {
                        return {
                            user: item._id,
                            cohortId: item.devMtn.cohortId,
                            firstName: item.firstName,
                            lastName: item.lastName
                        }
                    })
                    attendances.forEach(function (item, index, arrrrr) {
                        if (_.findWhere(daysAttendance, {
                                user: item.user
                            })) {
                            var append = _.findWhere(users, {
                                    user: item.user
                                })
                                // append.attendanceData = item.attendanceData;   old
                            item.attendanceData = append.attendanceData;
                            // append._id = item._id;
                            // //console.log("asdkfaksjdjjjjjjjjj", item)
                        }
                    })
                    // //console.log("daysAttendance", daysAttendance);
                    socket.emit('getInitialAttendance', daysAttendance)
                })
        })
    },
    getRecordedAttendanceForDateByCohort: function(req, res) {
        var targetDate = req.params.date;
        var targetCohortId = req.params.cohortId;

        //console.log('targetDate', targetDate);
        //console.log('targetCohortId', targetCohortId);

        Attendance.find({
            'attendanceData.dateOfAttendance': targetDate,
            cohortId: targetCohortId
        }).populate({
            path: 'user',
            select: 'firstName lastName'
        }).exec(function(err, result) {
            if (err) {
                console.log(err);
                res.send(err);
            } else {
                //console.log('result',result);
                var userIdArray = _.map(result, function(item) {
                    return item.user._id;
                });
                //console.log('userIdArray',userIdArray);
                User.find({'devMtn.cohortId': targetCohortId}).where('_id').nin(userIdArray).exec(function (err, users) {
                    if (err) {
                        console.log(err);
                    } else {
                        //console.log('users',users);
                        users = users.map(function(item) {
                            return {
                                user: {
                                    _id: item._id,
                                    firstName: item.firstName,
                                    lastName: item.lastName
                                },
                                cohortId: targetCohortId,
                                attendanceData: {
                                    timeIn: null,
                                    timeOut: null,
                                    score: null,
                                    dateOfAttendance: targetDate
                                }
                            }
                        })
                        var union = _.union(result, users);
                        //console.log('union', union);
                        res.json(union);
                    }
                })
            }
        })
    }
};
