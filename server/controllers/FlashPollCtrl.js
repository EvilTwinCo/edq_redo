var passportSocketIo = require('passport.socketio');

  var studentVotes = [];

module.exports = {

  handleFlashPollSubmit: function(socket, data) {
    studentVotes.push(data);
    // console.log('handleFlashPollSubmit Data:', studentVotes);
    socket.server.to('instructors').emit('flashPoll', studentVotes);
  }
//make a function that catches each persons vote, then send the whole array after the a b or c is pushed


};
