var Question = require('../models/Question');

module.exports = {
  handleStudentQuestionSubmit:function(socket, ioServer, data){
    //
    data.name = "I am a fake person. We need to figure out Auth. Hopefully David and Samson are having a good time of it."
    data.timeWhenEntered = new Date();
    Question.create(data, function(err, newQuestion){
      if(err){
        console.log (err);
      }
        ioServer.emit('questionForQueue', newQuestion);
        socket.emit('questionCreated', newQuestion);
    });
  }
}
