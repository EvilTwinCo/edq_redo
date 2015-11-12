var passportSocketIo = require('passport.socketio');

var studentVotes = [];

module.exports = {

  handleFlashPollSubmit: function(socket, data) {
    studentVotes.push(data);
    socket.server.to('instructors').emit('flashPoll', studentVotes);
  },

  handleFlashPollRemoval: function(socket) {
    studentVotes = [];
    socket.server.emit('togglePolls', true);
  }

};
