var Question = require('../models/Question');
var _ = require('underscore');
passportSocketIo = require('passport.socketio');
var liveFeedQueue = {
    28: [
        {
            question: '28 test question 1',
            studentSolution: '28 test solution 1'
        },
        {
            question: '28 test question 2',
            studentSolution: '28 test solution 2'
        }
    ],
    27: [
        {
            question: '27 test question 1',
            studentSolution: '27 test solution 1'
        },
        {
            question: '27 test question 2',
            studentSolution: '27 test solution 2'
        }
    ],
    26: [
        {
            question: '26 test question 1',
            studentSolution: '26 test solution 1'
        },
        {
            question: '26 test question 2',
            studentSolution: '26 test solution 2'
        }
    ]
};

module.exports = {
    handleStudentQuestionSubmit: function (socket, ioServer, data) {
        data.name = socket.request.user.firstName + " " + socket.request.user.lastName;
        data.studentId = socket.request.user.devMtn.id;
        data.cohortId = socket.request.user.devMtn.cohortId;
        data.timeWhenEntered = new Date();
        Question.create(data, function (err, newQuestion) {
            if (err) {
                console.log(err);
            }
            getPositionInQueue(data.name, null, function (position) {
                socket.emit('position in queue', position);
            });
            socket.server.to('instructors').emit('questionForQueue', newQuestion);
        });

    },
    handleStudentSolutionSubmit: function (socket, data) {
        Question.findOne({
                studentId: socket.request.user.devMtn.id
            })
            .sort({
                timeQuestionAnswered: -1
            })
            .exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                if (result) {
                    result.studentSolution = data.studentSolution;
                    result.save();
                    socket.server.to('student cohort:'+socket.request.user.devMtn.cohortId).emit('new live feed', {
                        question: result.question,
                        solution: data.studentSolution
                    });
                }
            });
    },
    handleStudentDropFromQueue: function (socket, time) {
        Question.findOne({
                studentId: socket.request.user.devMtn.id,
                timeQuestionAnswered: null
            })
            .exec(function (err, result) {
                result.timeQuestionAnswered = new Date();
                result.save();
            });
    },
    qetMyCurrentQuestion: function (socket) {
        var that = this;
        Question.findOne({
                studentId: socket.request.user.devMtn.id,
                timeQuestionAnswered: null
            })
            .exec(function (err, result) {
                if (result) {
                    socket.emit('my current question is', result);
                    getPositionInQueue(result.name, null, function (position) {
                        socket.emit('position in queue', position);
                    });
                }
            });
    },
    getAllQuestionsAsked: function (socket, data) {
        Question.find({
                timeQuestionAnswered: null,
                cohortId: data.cohortId
            })
            .exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                socket.emit('getAllQuestionsAsked', result);
            });
    },
    addingQuestionAndSolution: function (socket, data) {
        console.log(data);
        dataToUpdate = {
            mentorSolution: data.reviewedAnswer,
            questionCategory: data.reviewedQuestion
        };
        Question.findByIdAndUpdate(data._id, dataToUpdate)
            .exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
            });
    },
    mentorBegins: function (socket, ioServer, data) {
        var dataToUpdate = {
            _id: data._id,
            mentorName: socket.request.user.firstName + " " + socket.request.user.lastName,
            timeMentorBegins: new Date()
        };
        console.log("Mentor Begins", dataToUpdate);
        Question.findByIdAndUpdate(data._id, dataToUpdate, {
                new: true
            })
            .exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
            socket.server.to('instructors').emit('mentorBegins', result);
            });
    },
    questionResolve: function (socket, data) {
        var dataToUpdate = {
            _id: data._id,
            timeQuestionAnswered: new Date()
        };
        Question.findByIdAndUpdate(data._id, dataToUpdate, {
                new: true
            })
            .exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                console.log("question Resolve Emit");
                passportSocketIo.filterSocketsByUser(socket.server, function (user) {
                    return user.devMtn.id === result.studentId;
                }).forEach(function (socket) {

                    socket.emit('my current question is', result);
                });
                emitAllPositionsInQueue(socket.server, result.cohortId);
            });
    },
    handleQuestionRemovalRequest: function (socket, ioServer, question) {
        if (!question.studentId) {
            question.studentId = socket.request.user.devMtn.id;
        }

        emitAllPositionsInQueue(ioServer, socket.request.user.devMtn.cohortId);
        socket.server.to('instructors').emit('remove question from queue', question);
    },
    handleStudentSolution: function (socket, data) {
        var cohortId = socket.request.user.devMtn.cohortId;
        var numberToKeep = 10;
        if (!liveFeedQueue[cohortId]) {
            liveFeedQueue[cohortId] = [];
        }
        liveFeedQueue[cohortId].push({question: data.question, studentSolution: data.studentSolution});
        for (var i=0; i < liveFeedQueue[cohortId].length - numberToKeep; i++) {
            liveFeedQueue[cohortId].shift();
        }

        console.log('submitting to student cohort:' + cohortId + 'the following:' + data);
        socket.server.to('student cohort:' + cohortId).emit('liveFeed', data);
    },
    handleLiveFeedQueueRequest: function (socket, adminSelectedCohortId) {
        console.log(adminSelectedCohortId);
    if (adminSelectedCohortId) {
        cohortId = adminSelectedCohortId;
    } else {
        cohortId = socket.request.user.devMtn.cohortId;
    }
    console.log(cohortId);
    socket.emit('server response: initial live feed queue', liveFeedQueue[cohortId])
    },
    handleStatsQuery: function (socket, query) {
        console.log("Start Query");
        Question.find({})
            .select('name studentId cohortId mentorName directive timeWhenEntered timeMentorBegins timeQuestionAnswered questionCategory')
            .exec(function (err, result) {
                if (err) {
                    console.log(err);
                }
                socket.emit('report queue stat data', result);
            });
    }
};

function getPositionInQueue(student, cohort, callback) {
    //TODO include logic to limit to your cohort/track
    Question.find({
            timeQuestionAnswered: null
        })
        .select('name')
        .exec(function (err, result) {
            var names = _.pluck(result, 'name');
            callback(_.indexOf(names, student));
        });
}

function emitAllPositionsInQueue(ioServer, cohort) {
    //TODO include logic to limit to cohort/track
    console.log('emitAllPositionsInQueue function');
    Question.find({
            timeQuestionAnswered: null
        }).select('studentId')
        .exec(function (err, result) {

            result.forEach(function (studentId, index) {

                passportSocketIo.filterSocketsByUser(ioServer, function (user) {
                    return user.devMtn.id === questions.studentId;
                }).forEach(function (socket) {
                    socket.emit('position in queue', index);
                });
            });
        });
}
