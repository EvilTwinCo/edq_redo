var passportSocketIo = require('passport.socketio');

<<<<<<< HEAD
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

=======
module.exports = {

  handleFlashPollSubmit: function(socket, data) {
    console.log('handleFlashPollSubmit Data:', data);
    socket.server.to('instructors').emit('flashPoll', data);
  }
>>>>>>> adminDashboard
};
