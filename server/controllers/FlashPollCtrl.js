var LearningObjective = require('../models/FlashPoll.js');

module.exports = {
  handleFlashPoll: function(ioServer, socket, data) {
    FlashPoll.create(data, createFlashPollAnswer)
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('flashPoll', createFlashPollAnswer);
        socket.emit('FlashPollCreated', createFlashPollAnswer);
      });
  },
  getAllFlashPoll: function(ioServer) {
    LearningObjective.find({})
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('getFlashPoll', result);
        console.log(result);
      });
  },
  updateFlashPoll: function(ioServer, data) {
    FlashPoll.findByIdAndUpdate(data._id, data)
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('updatedFlashPoll', result);
        console.log(result);
      });
  },
  removeFlashPoll: function(ioServer, data) {
    FlashPoll.findByIdAndRemove(data._id)
      .exec(function(err, result) {
        if (err) {
          console.log(err);
        }
        ioServer.emit('removeFlashPoll', result);
        socket.emit('flashPollRemoved', result);
        console.log(result);
      });
  }
};
