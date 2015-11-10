var passportSocketIo = require('passport.socketio');

module.exports = {

  handleFlashPollSubmit: function(socket, data) {
    console.log('handleFlashPollSubmit Data:', data);
    socket.server.to('instructors').emit('flashPoll', data);
  }
};
