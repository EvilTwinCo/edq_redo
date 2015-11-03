var Question = require('../models/Question');

module.exports = {
  handleStudentQuestionSubmit:function(ioServer, data){
    //
    data.name = "I am a fake person. We need to figure out Auth. Hopefully David and Samson are having a good time of it."
    data.timeWhenEntered = new Date();
    console.log(data);
    console.log(Question);
    Question.create(data, function(err, newQuestion){
      if(err){
        console.log (err);
      }
        console.log("No DB error, send info to mentors!");
        ioServer.emit('questionForQueue', newQuestion);

    });
  }
}
