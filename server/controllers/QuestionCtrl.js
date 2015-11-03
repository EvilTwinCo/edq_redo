var Question = require('../models/Question');

module.exports = {
  handleStudentQuestionSubmit:function(ioServer, data){
    //
    data.name = "I am a fake person. We need to figure out Auth. Hopefully David and Samson are having a good time of it."
    data.timeWhenEntered = new Date();
    Question.create(data, function(err, newQuestion){
      if(err){
        console.log (err);
      }
        ioServer.emit('questionForQueue', newQuestion);
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
    Question.findByIdAndUpdate(data._id, data)
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      socket.emit('mentorBegins', result);
      console.log(result);
    });
  },

  questionResolve: function(socket, data){
    Question.findByIdAndUpdate(data._id, data)
    .exec(function(err, result){
      if(err){
        console.log(err);
      }
      socket.emit('questionResolve', result);
      console.log(result);
    });
  }

};
