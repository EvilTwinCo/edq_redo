var Question = require('../models/Question');

module.exports = {
  handleStudentQuestionSubmit:function(socket, ioServer, data){
    data.name = socket.request.user.firstName + " " + socket.request.user.lastName;

    data.timeWhenEntered = new Date();
    Question.create(data, function(err, newQuestion){
      if(err){
        console.log (err);
      }
        socket.server.emit('questionForQueue', newQuestion);
        socket.emit('questionCreated', newQuestion);
    });
  },

  getAllQuestionsAsked: function(socket){
    Question.find({timeQuestionAnswered : null})
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      socket.emit('getAllQuestionsAsked', result);
      console.log(result);
    });
  },

  addingQuestionAndSolution: function(socket, data){
    Question.findByIdAndUpdate(data._id, data)
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      console.log(result);
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
      console.log(result);
    });
  },

  questionResolve: function(socket, data){
    console.log(data);
    var dataToUpdate = {
      _id:data._id,
      timeQuestionAnswered:data.timeQuestionAnswered,
      mentorSolution:data.reviewedAnswer,
      questionCategory:data.reviewedQuestion
    }
    Question.findByIdAndUpdate(data._id, dataToUpdate)
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      socket.emit('questionResolve', result);
      console.log(result);
    });
  }

};
