var passportSocketIo = require('passport.socketio');


var studentVotes = [];

module.exports = {

  handleFlashPollSubmit: function(socket, data) {
    studentVotes.push(data);
    socket.server.to('instructors').emit('flashPoll', studentVotes);
  },

  handleFlashPollRemoval: function(socket, cohortId) {
    studentVotes = [];
      console.log('flash poll', cohortId);
      socket.server.to('student cohort:'+cohortId).emit('togglePolls', true);
  }

};
