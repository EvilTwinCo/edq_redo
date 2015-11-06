var Question = require('../models/Question');
var passportSocketIo = require('passport.socketio');
var _ = require('underscore');


module.exports = {
  handleStudentQuestionSubmit:function(socket, ioServer, data){
    data.name = socket.request.user.firstName + " " + socket.request.user.lastName;
      data.studentId = socket.request.user.devMtn.id;
    data.timeWhenEntered = new Date();
    Question.create(data, function(err, newQuestion){
      if(err){
        console.log (err);
      }
        getPositionInQueue(data.name, null, function(position){
          socket.emit('position in queue', position);
        });
        ioServer.emit('questionForQueue', newQuestion);
        socket.emit('my current question is', newQuestion);
    });
  },
  handleStudentSolutionSubmit:function(socket, data){
    console.log("start student submission");
    Question.findOne({
      studentId:socket.request.user.devMtn.id
    })
    .sort({timeQuestionAnswered:-1})
    .exec(function(err, result){
        if (err){
          console.log(err)
        }
        if (result){
          result.studentSolution = data.studentSolution;
          result.save();

          socket.server.emit('new live feed', {
            question:result.question,
            solution:data.studentSolution
          });
        }
    })
  },
  handleStudentDropFromQueue: function(socket, time){
  Question.findOne({studentId:socket.request.user.devMtn.id, timeQuestionAnswered:null})
    .exec(function (err, result){
      result.timeQuestionAnswered = time;
      result.save();
      socket.emit('my current question is', result);
    })
  },
  qetMyCurrentQuestion: function(socket){
    Question.findOne({studentId:socket.request.user.devMtn.id, timeQuestionAnswered:null})
      .exec(function(err, result){
        socket.emit('my current question is', result)
      })
  },
  getAllQuestionsAsked: function(socket){
    Question.find({timeQuestionAnswered : null})
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      socket.emit('getAllQuestionsAsked', result);
    });
  },

  addingQuestionAndSolution: function(socket, data){
    Question.findByIdAndUpdate(data._id, data)
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
    });
  },

  mentorBegins: function(ioServer, data){
    var dataToUpdate = {
      _id:data._id,
      mentorName:data.mentorName,
      timeMentorBegins:data.timeMentorBegins
    }
    Question.findByIdAndUpdate(data._id, dataToUpdate)
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      ioServer.emit('mentorBegins', result);
    });
  },

  questionResolve: function(socket, data){
    var dataToUpdate = {
      _id:data._id,
      timeQuestionAnswered:data.timeQuestionAnswered,
      mentorSolution:data.reviewedAnswer,
      questionCategory:data.reviewedQuestion
    }
    Question.findByIdAndUpdate(data._id, dataToUpdate, {new:true})
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      console.log("question Resolve Emit");
      passportSocketIo.filterSocketsByUser(socket.server, function(user){
        return user.devMtn.id === result.studentId
      }).forEach(function (socket){

        socket.emit('my current question is', result)
      });
      emitAllPositionsInQueue(socket.server, null);
    });
  }
};


function getPositionInQueue(student, cohort, callback){
  //TODO include logic to limit to your cohort/track
  Question.find({
    timeQuestionAnswered:null
  })
  .select('name')
  .exec(function(err, result){
    var names= _.pluck(result, 'name');
    callback(_.indexOf(names,student));
  })
}

function emitAllPositionsInQueue(ioServer, cohort){
  //TODO include logic to limit to cohort/track
  Question.find({
    timeQuestionAnswered:null
  }).select('studentId')
  .exec(function(err, result){
    result.forEach(function(studentId, index){
      passportSocketIo.filterSocketsByUser(ioServer, function(user){
          return user.devMtn.id = studentId;
      }).forEach(function(socket){
        socket.emit('position in queue', index)
      });
    })
  })
}
