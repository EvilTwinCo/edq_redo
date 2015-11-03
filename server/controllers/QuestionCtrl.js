var Question = require('../models/Question');

module.exports = {
  handleStudentQuestionSubmit:function(ioServer, data){
    console.log(data);
    Question.create(data, function(err, newQuestion){
      ioServer.to('instructors').emit('questionForQueue', newQuestion);
    });
  }
}
