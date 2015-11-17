var passportSocketIo = require('passport.socketio');


var studentVotes = [];
var openCohortPolls = {};

module.exports = {

  handleFlashPollSubmit: function(socket, data) {
      var cohortId = socket.request.user.devMtn.cohortId;
      var studentId = socket.request.user.devMtn.id;
      studentVotes.push(data);
    socket.server.to('instructors').emit('flashPoll', studentVotes);
      openCohortPolls[cohortId].push(studentId);
  },

  handleFlashPollRemoval: function(socket, cohortId) {
        studentVotes = [];
        openCohortPolls[cohortId] = [];
      setTimeout(removeOpenPoll.bind(null, cohortId), 1000*60*5);
      socket.server.to('student cohort:'+cohortId).emit('togglePolls', true);
  },
    
    handleFlashPollGetStatus: function(socket) {
        var cohortId = socket.request.user.devMtn.cohortId;
        var studentId = socket.request.user.devMtn.id;
        if (openCohortPolls[cohortId]) {
            if (openCohortPolls[cohortId].indexOf(studentId) === -1) {
                socket.server.to('student cohort:'+cohortId).emit('togglePolls', true);
            }
        }
    }
};

function removeOpenPoll(cohortId) {
    console.log('deleting openCohortPolls['+cohortId+']')
     delete openCohortPolls[cohortId]
}